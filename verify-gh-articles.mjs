import { neon } from "@neondatabase/serverless";
import { loadLocalEnv } from "./scripts/load-env.mjs";

loadLocalEnv();
const sql = neon(process.env.DATABASE_URL);

const rows = await sql.query(
  `select slug, length(content) as len,
          (position('<' in content) > 0) as has_lt,
          (position('## Project này là gì?' in content) > 0) as h1,
          (position('## Vì sao làm project này?' in content) > 0) as h2,
          (position('## Vấn đề hoặc mục tiêu cần giải quyết' in content) > 0) as h3,
          (position('## Vai trò của tôi trong project' in content) > 0) as h4,
          (position('## Kết quả và những gì học được' in content) > 0) as h5
     from projects
    where slug like 'gh-%'
    order by slug`
);

const all = await sql.query(`select slug from projects order by slug`);
console.log(`total projects=${all.length}`);
console.log(`gh rows=${rows.length}`);

let fail = 0;
for (const r of rows) {
  const ok = r.len > 800 && !r.has_lt && r.h1 && r.h2 && r.h3 && r.h4 && r.h5;
  if (!ok) fail += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${r.slug} len=${r.len} lt=${r.has_lt} h=${r.h1}${r.h2}${r.h3}${r.h4}${r.h5}`
  );
}

if (rows.length !== 18 || fail) {
  process.exit(1);
}
console.log("STEP4 DB: 18 gh- rows, content>800, no <, five headings present.");
