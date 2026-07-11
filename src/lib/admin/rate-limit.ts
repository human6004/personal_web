import { dbQuery, hasDatabaseUrl } from "@/lib/db/neon";

// ponytail: rate-limit per-IP qua Neon (serverless -> in-memory không sống qua
// nhiều lambda). Đủ cho single-admin login. Nâng lên Redis nếu cần throughput cao.
const MAX_ATTEMPTS = 5; // cho thử 5 lần; lần thứ 6 trong window bị khoá
const WINDOW_MINUTES = 15;
const LOCK_MINUTES = 15;

type AttemptRow = {
  attempts: number;
  locked_until: string | Date | null;
  locked: boolean;
};

function retryAfterSeconds(lockedUntil: string | Date | null): number {
  if (!lockedUntil) {
    return LOCK_MINUTES * 60;
  }

  const until = lockedUntil instanceof Date ? lockedUntil : new Date(lockedUntil);
  const diffMs = until.getTime() - Date.now();
  return Math.max(1, Math.ceil(diffMs / 1000));
}

/**
 * Ghi nhận một lần thử login từ `ip` và cho biết có bị chặn không.
 * Gọi TRƯỚC khi verify password. Upsert atomic để tránh race giữa các lambda:
 * - đang bị khoá  -> giữ nguyên, trả ok=false
 * - window hết hạn -> reset counter về 1
 * - vượt ngưỡng    -> đặt khoá và trả ok=false
 * Fail-open nếu DB lỗi (không khoá oan người dùng thật vì DB chập chờn).
 */
export async function checkAndConsumeLoginAttempt(
  ip: string
): Promise<{ ok: boolean; retryAfterSec?: number }> {
  if (!ip || !hasDatabaseUrl()) {
    return { ok: true };
  }

  try {
    const rows = await dbQuery<AttemptRow>(
      `insert into login_attempts (ip, attempts, first_attempt_at, locked_until)
       values ($1, 1, now(), null)
       on conflict (ip) do update set
         attempts = case
           when login_attempts.locked_until is not null and login_attempts.locked_until > now()
             then login_attempts.attempts
           when login_attempts.first_attempt_at < now() - ($2 || ' minutes')::interval
             then 1
           else login_attempts.attempts + 1
         end,
         first_attempt_at = case
           when (login_attempts.locked_until is null or login_attempts.locked_until <= now())
                and login_attempts.first_attempt_at < now() - ($2 || ' minutes')::interval
             then now()
           else login_attempts.first_attempt_at
         end,
         locked_until = case
           when login_attempts.locked_until is not null and login_attempts.locked_until > now()
             then login_attempts.locked_until
           when (case
                   when login_attempts.first_attempt_at < now() - ($2 || ' minutes')::interval then 1
                   else login_attempts.attempts + 1
                 end) > $3
             then now() + ($4 || ' minutes')::interval
           else login_attempts.locked_until
         end
       returning attempts, locked_until,
         (locked_until is not null and locked_until > now()) as locked`,
      [ip, String(WINDOW_MINUTES), MAX_ATTEMPTS, String(LOCK_MINUTES)]
    );

    const row = rows[0];
    if (row?.locked) {
      return { ok: false, retryAfterSec: retryAfterSeconds(row.locked_until) };
    }

    return { ok: true };
  } catch (error) {
    // SECURITY: brute-force lockout tạm thời VÔ HIỆU khi DB lỗi. Prefix riêng để
    // dựng alert (log-based metric) khi vận hành, tránh chìm trong log thường.
    console.error("[SECURITY][rate-limit-fail-open] login lockout disabled:", error);
    return { ok: true };
  }
}

/** Xoá bộ đếm khi login thành công. */
export async function clearLoginAttempts(ip: string): Promise<void> {
  if (!ip || !hasDatabaseUrl()) {
    return;
  }

  try {
    await dbQuery(`delete from login_attempts where ip = $1`, [ip]);
  } catch (error) {
    console.error("Login rate-limit clear failed:", error);
  }
}
