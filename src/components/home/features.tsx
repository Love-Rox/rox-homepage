
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title: string;
  features: Feature[];
}

export const Features = ({ title, features }: FeaturesProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-12 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 group hover:border-primary-500 dark:hover:border-primary-400"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
