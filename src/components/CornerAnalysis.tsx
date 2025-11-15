import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface CornerData {
  corner: number;
  name: string;
  optimalSpeed: number;
  optimalBraking: number;
  optimalLine: string;
  difficulty: "low" | "medium" | "high";
}

export const CornerAnalysis = () => {
  const corners: CornerData[] = [
    { corner: 1, name: "Turn 1", optimalSpeed: 185, optimalBraking: 95, optimalLine: "Late apex", difficulty: "medium" },
    { corner: 2, name: "Turn 2-3", optimalSpeed: 145, optimalBraking: 85, optimalLine: "Early entry", difficulty: "high" },
    { corner: 3, name: "Turn 4-5", optimalSpeed: 220, optimalBraking: 105, optimalLine: "Wide entry", difficulty: "low" },
    { corner: 6, name: "Turn 6-7", optimalSpeed: 95, optimalBraking: 115, optimalLine: "Tight apex", difficulty: "high" },
    { corner: 11, name: "Turn 11", optimalSpeed: 175, optimalBraking: 92, optimalLine: "Mid apex", difficulty: "medium" },
    { corner: 15, name: "Turn 15", optimalSpeed: 125, optimalBraking: 88, optimalLine: "Late brake", difficulty: "high" },
  ];

  return (
    <Card className="bg-gradient-carbon border-2 border-border p-4">
      <h3 className="text-sm font-bold text-foreground tracking-wider mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        CORNER-BY-CORNER DRIVER INSIGHTS
      </h3>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="all">ALL</TabsTrigger>
          <TabsTrigger value="slow">SLOW</TabsTrigger>
          <TabsTrigger value="medium">MEDIUM</TabsTrigger>
          <TabsTrigger value="fast">FAST</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3 max-h-[400px] overflow-y-auto">
          {corners.map((corner) => (
            <CornerCard key={corner.corner} corner={corner} />
          ))}
        </TabsContent>
        
        <TabsContent value="slow" className="space-y-3 max-h-[400px] overflow-y-auto">
          {corners.filter(c => c.optimalSpeed < 150).map((corner) => (
            <CornerCard key={corner.corner} corner={corner} />
          ))}
        </TabsContent>
        
        <TabsContent value="medium" className="space-y-3 max-h-[400px] overflow-y-auto">
          {corners.filter(c => c.optimalSpeed >= 150 && c.optimalSpeed < 200).map((corner) => (
            <CornerCard key={corner.corner} corner={corner} />
          ))}
        </TabsContent>
        
        <TabsContent value="fast" className="space-y-3 max-h-[400px] overflow-y-auto">
          {corners.filter(c => c.optimalSpeed >= 200).map((corner) => (
            <CornerCard key={corner.corner} corner={corner} />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const CornerCard = ({ corner }: { corner: CornerData }) => {
  const difficultyColor = {
    low: "text-green-400",
    medium: "text-yellow-400",
    high: "text-red-400"
  }[corner.difficulty];

  return (
    <div className="bg-black/40 rounded-lg p-3 border border-border/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">T{corner.corner}</span>
          <span className="text-sm text-muted-foreground font-mono">{corner.name}</span>
        </div>
        <span className={`text-xs font-bold font-mono uppercase ${difficultyColor}`}>
          {corner.difficulty}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <p className="text-xs text-muted-foreground font-mono">SPEED</p>
          <p className="text-sm font-bold text-green-400">{corner.optimalSpeed} km/h</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-mono">BRAKE</p>
          <p className="text-sm font-bold text-cyan-400">{corner.optimalBraking}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-mono">LINE</p>
          <p className="text-sm font-bold text-foreground">{corner.optimalLine}</p>
        </div>
      </div>
    </div>
  );
};
