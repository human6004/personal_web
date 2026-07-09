import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { getDatabaseProfile } from "./db/profile";
import { hasDatabaseUrl } from "./db/neon";

const stringArray = z.array(z.string());

// URL/handle do admin nhập rồi đổ thẳng vào <a href>. Chặn các protocol có thể
// chạy script (javascript:/data:/vbscript:) -> self-XSS. Cho phép phần còn lại
// (https, mailto, path nội bộ, username thô) để không phá dữ liệu sẵn có.
const dangerousProtocol = /^\s*(javascript|data|vbscript):/i;

export const urlOrEmpty = z
  .string()
  .trim()
  .refine((value) => !dangerousProtocol.test(value), "This URL is not allowed.")
  .default("");

export const profileSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(320),
  tagline: z.string().min(1).max(240),
  englishTagline: z.string().max(240).default(""),
  socials: z.object({
    github: urlOrEmpty,
    linkedin: urlOrEmpty,
    facebook: urlOrEmpty,
    // email nhập thô rồi wrap `mailto:` cứng khi render -> chỉ cần chặn protocol nguy hiểm.
    email: urlOrEmpty,
    cv: urlOrEmpty
  }),
  home: z.object({
    avatarImage: z.string().min(1).default("/images/avatar.svg"),
    heroEyebrow: z.string().max(80).default(""),
    heroTitle: z.string().min(1).max(160),
    heroDescription: z.string().min(1).max(320),
    nowTitle: z.string().min(1).max(80),
    nowBody: stringArray.min(1)
  }),
  about: z.object({
    metadataDescription: z.string().min(1).max(320),
    eyebrow: z.string().max(80).default("About"),
    title: z.string().min(1).max(180),
    intro: z.string().min(1).max(900),
    interestsTitle: z.string().min(1).max(120),
    interests: stringArray.min(1),
    practicesTitle: z.string().min(1).max(120),
    practices: z
      .array(
        z.object({
          title: z.string().min(1).max(120),
          body: z.string().min(1).max(500)
        })
      )
      .min(1),
    directionTitle: z.string().min(1).max(120),
    directionBody: z.string().min(1).max(900)
  })
});

export type EditableProfile = z.infer<typeof profileSchema>;

export const defaultProfile: EditableProfile = {
  name: "Nhan",
  title: "Nhan - Personal Portfolio + Knowledge Blog",
  description:
    "Một không gian cá nhân để ghi lại hành trình phát triển, project, bài viết và những điều đáng chú ý trên đường học tập.",
  tagline:
    "Mình viết, học, xây dựng project và lưu lại những điều đáng chú ý trên hành trình phát triển cá nhân.",
  englishTagline:
    "I write, build, and collect ideas across tech, learning, and everyday curiosity.",
  socials: {
    github: "",
    linkedin: "",
    facebook: "",
    email: "",
    cv: ""
  },
  home: {
    avatarImage: "/images/avatar.svg",
    heroEyebrow: "Personal portfolio + knowledge blog",
    heroTitle: "Một nơi để viết, học và xây dựng project.",
    heroDescription:
      "Mình viết, học, xây dựng project và lưu lại những điều đáng chú ý trên hành trình phát triển cá nhân.",
    nowTitle: "Now",
    nowBody: [
      "Mình đang xây một hệ thống nhỏ để lưu lại project, bài viết và những điều đáng chú ý trong quá trình học. Website này là nơi thử cách trình bày đó một cách rõ ràng hơn.",
      "Trọng tâm hiện tại là viết đều hơn, build có chủ đích hơn, và giữ lại các ghi chú đủ sạch để sau này có thể quay lại."
    ]
  },
  about: {
    metadataDescription:
      "Câu chuyện cá nhân ngắn, điều đang quan tâm, cách học và cách xây dựng project.",
    eyebrow: "About",
    title: "Một không gian nhỏ để theo dõi hành trình phát triển.",
    intro:
      "Đây là phần giới thiệu mở, được viết để dễ thay bằng thông tin thật của bạn sau này. Trọng tâm là câu chuyện cá nhân, điều đang quan tâm, cách học, cách ghi chú và cách biến ý tưởng thành project.",
    interestsTitle: "Những điều mình đang quan tâm",
    interests: [
      "Học tập có hệ thống",
      "Viết và ghi chú",
      "Công nghệ hữu ích",
      "Project cá nhân",
      "Công cụ làm việc",
      "Trải nghiệm đời sống"
    ],
    practicesTitle: "Cách mình học và xây dựng project",
    practices: [
      {
        title: "Học bằng cách đặt câu hỏi",
        body: "Mình muốn mỗi bài đọc hoặc project đều để lại một câu hỏi rõ hơn, không chỉ một đoạn ghi chú dài."
      },
      {
        title: "Ghi chú để quay lại",
        body: "Ghi chú cần có ngữ cảnh, ý chính và lý do giữ lại. Nếu không quay lại được, ghi chú chưa thật sự hữu ích."
      },
      {
        title: "Build để hiểu sâu hơn",
        body: "Project giúp biến lý thuyết thành thứ có thể thử, sửa và nhìn thấy giới hạn."
      }
    ],
    directionTitle: "Định hướng sắp tới",
    directionBody:
      "Tiếp tục gom project, viết các bài ghi chú ngắn hơn nhưng đều hơn, và biến website này thành nơi phản ánh rõ hơn cách bạn học, làm và quan sát thế giới xung quanh."
  }
};

function profilePath(root = process.cwd()) {
  return path.join(root, "content", "profile.json");
}

export function getProfileFromFile(root = process.cwd()): EditableProfile {
  const filePath = profilePath(root);

  if (!fs.existsSync(filePath)) {
    return defaultProfile;
  }

  const source = fs.readFileSync(filePath, "utf8");
  return profileSchema.parse(JSON.parse(source));
}

export async function getProfile(root = process.cwd()): Promise<EditableProfile> {
  if (hasDatabaseUrl()) {
    return profileSchema.parse((await getDatabaseProfile()) || defaultProfile);
  }

  return getProfileFromFile(root);
}

export function writeProfileToFile(profile: EditableProfile, root = process.cwd()) {
  const parsed = profileSchema.parse(profile);
  const filePath = profilePath(root);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");

  return parsed;
}
