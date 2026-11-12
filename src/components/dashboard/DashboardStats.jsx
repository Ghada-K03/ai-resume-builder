import { Files, CircleCheck, FilePenLine } from "lucide-react";

export default function DashboardStats({ total, completed, drafts }) {
  const stats = [
    {
      title: "Total Resumes",
      value: total,
      icon: Files,
    },
    {
      title: "Completed",
      value: completed,
      icon: CircleCheck,
    },
    {
      title: "Drafts",
      value: drafts,
      icon: FilePenLine,
    },
  ];

  return (
    <section className="dashboard-stats">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article className="stat-card" key={stat.title}>
            <div className="stat-icon">
              <Icon size={23} />
            </div>

            <div>
              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
            </div>
          </article>
        );
      })}
    </section>
  );
}
