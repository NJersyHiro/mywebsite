import type { Metadata } from "next";
import SkillBar from "@/components/about/SkillBar";
import CertBadge from "@/components/about/CertBadge";

export const metadata: Metadata = {
  title: "About | HY",
  description:
    "山本浩裕 - AIを製品として組み込めるフルスタックエンジニア。経歴・スキル・資格の紹介。",
};

const certifications = [
  "応用情報技術者",
  "AWS SAP",
  "LPIC Level 3",
  "Java Gold",
  "CCNA",
  "Salesforce Platform Admin",
  "Salesforce Agentforce Specialist",
];

const skillCategories = [
  {
    label: "言語",
    skills: [
      { name: "Python", months: 16 },
      { name: "TypeScript/JavaScript", months: 14 },
      { name: "Apex/SOQL", months: 7 },
      { name: "C", months: 7 },
      { name: "Go", months: 5 },
    ],
  },
  {
    label: "フレームワーク",
    skills: [
      { name: "React", months: 9 },
      { name: "NestJS", months: 5 },
      { name: "Electron", months: 5 },
      { name: "Next.js", months: 4 },
    ],
  },
  {
    label: "AI/LLM",
    skills: [
      { name: "LLM API設計 (Gemini/OpenAI)", months: 11 },
      { name: "プロンプトエンジニアリング", months: 11 },
      { name: "AIエージェント設計", months: 5 },
    ],
  },
  {
    label: "DB",
    skills: [
      { name: "PostgreSQL", months: 16 },
      { name: "MongoDB", months: 5 },
    ],
  },
  {
    label: "クラウド/インフラ",
    skills: [
      { name: "Linux", months: 19 },
      { name: "Kubernetes/OpenShift", months: 15 },
      { name: "Docker", months: 5 },
      { name: "AWS", months: 5 },
      { name: "Azure", months: 5 },
    ],
  },
  {
    label: "DevOps",
    skills: [
      { name: "Git", months: 32 },
      { name: "GitHub Actions", months: 16 },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            About
          </h1>
          <p className="text-text-sub text-lg">自己紹介</p>
        </div>

        {/* Bio section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">山本浩裕</h2>
          <p className="text-lg text-neon-blue font-medium mb-6">
            AIを製品として組み込めるフルスタックエンジニア
          </p>
          <div className="space-y-4 text-text-sub leading-relaxed">
            <p>
              アメリカのニュージャージー州で経営学を学び、帰国後にIT業界へ。
            </p>
            <p>
              LLM
              API設計・エージェント設計・データ設計・SaaS化を軸に活動しています。
            </p>
            <p>
              TypeScriptベースのフルスタック開発（React / Next.js /
              NestJS）とAI API活用が得意です。
            </p>
          </div>
        </section>

        {/* Certifications section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">資格</h2>
          <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <CertBadge key={cert} name={cert} />
            ))}
          </div>
        </section>

        {/* Skills section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">スキル</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {skillCategories.map((category) => (
              <div key={category.label}>
                <h3 className="text-lg font-medium text-neon-blue mb-4">
                  {category.label}
                </h3>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      months={skill.months}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
