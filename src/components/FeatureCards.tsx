import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, Shield, Lock } from "lucide-react";

export const FeatureCards = forwardRef<HTMLDivElement>((props, ref) => {
  const features = [
    {
      icon: Cpu,
      title: "On-Device Processing",
      description: "TensorFlow.js runs locally - no server uploads",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Real-time predictions with low latency",
    },
    {
      icon: Shield,
      title: "Decision Support",
      description: "AI-assisted triage for faster workflows",
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description: "Images never leave your browser",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      {...props}
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.05 }}
          className="medical-card p-4 flex flex-col gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <feature.icon className="h-4 w-4 text-primary" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
});

FeatureCards.displayName = "FeatureCards";
