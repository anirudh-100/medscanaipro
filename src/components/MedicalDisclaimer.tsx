import { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const MedicalDisclaimer = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-medical-warning-light border border-medical-warning/30 rounded-xl p-4 flex items-start gap-3"
      {...props}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-medical-warning/20">
        <AlertTriangle className="h-4 w-4 text-medical-warning" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Medical Disclaimer
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          For triage assistance only. This tool is a prototype and does not replace a professional 
          radiologist's diagnosis. Always consult qualified medical professionals for clinical decisions.
        </p>
      </div>
    </motion.div>
  );
});

MedicalDisclaimer.displayName = "MedicalDisclaimer";
