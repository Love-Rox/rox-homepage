import { Button } from "@/components/common/button";
import { Card } from "@/components/common/card";

interface StackItem {
  name: string;
  src: string;
  href: string;
  description: string;
}

interface StacksProps {
  title: string;
  tech: StackItem[];
}

export const Stacks = ({ title, tech }: StacksProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-surface-muted py-12 rounded-lg">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tech.map((stack) => (
          <Card key={stack.name} variant="muted" className="grid grid-cols-1 items-center p-6">
            <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center mb-4">
              {stack.name}
            </div>
            <img
              src={stack.src}
              alt={stack.name}
              className="h-16 w-16 object-contain mb-4 mx-auto"
            />
            <div>
              <p className="text-center text-slate-600 dark:text-slate-300">{stack.description}</p>
              <div className="mt-4 flex justify-center">
                <Button href={stack.href} variant="primary" size="md">
                  Learn {stack.name} more &rarr;
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
