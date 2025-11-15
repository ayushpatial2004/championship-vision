import { useState } from 'react';
import { Track3DView } from '@/components/3d/Track3DView';
import { DriverBattle3D } from '@/components/3d/DriverBattle3D';
import { Strategy3DSim } from '@/components/3d/Strategy3DSim';
import { DriverReport } from '@/components/DriverReport';
import { useRacingData } from '@/hooks/useRacingData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Box, Users, TrendingUp, FileText } from 'lucide-react';

export default function Advanced3D() {
  const { driverStats, loading } = useRacingData(2);
  const [selectedDriverNumber, setSelectedDriverNumber] = useState<string>('');

  const selectedDriver = driverStats.find(d => d.number === selectedDriverNumber);

  if (loading) {
    return <LoadingScreen onLoadingComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
            Advanced 3D Racing Analytics
          </h1>
          <p className="text-muted-foreground">
            Immersive 3D track visualization, driver battles, strategy simulation, and AI-powered insights
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="track3d" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="track3d" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              3D Track View
            </TabsTrigger>
            <TabsTrigger value="battle" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Driver Battle
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Strategy Sim
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              AI Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="track3d" className="space-y-6">
            <Card className="p-6 bg-background/95 backdrop-blur border-primary/20">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Select Driver for Ghost Replay</h3>
                <Select value={selectedDriverNumber} onValueChange={setSelectedDriverNumber}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Choose a driver to see their best lap replay" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverStats.map(driver => (
                      <SelectItem key={driver.number} value={driver.number}>
                        #{driver.number} - {driver.vehicle} - Best: {driver.bestLap.toFixed(3)}s
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-foreground">Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Racing Line Heatmap:</strong> Blue (slow) → Orange (medium) → Red (fast corners)</li>
                    <li>• <strong>Speed Zone Overlays:</strong> Visual indicators showing braking zones and acceleration areas</li>
                    <li>• <strong>Ghost Car Replay:</strong> Watch the driver's best lap with full camera controls</li>
                    <li>• <strong>Corner Markers:</strong> Green markers indicate overtaking zones, white for other corners</li>
                    <li>• <strong>Timeline Scrubber:</strong> Jump to any point in the lap using the progress slider</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Track3DView
              driverData={selectedDriver ? {
                id: selectedDriver.number,
                number: selectedDriver.number,
                bestLap: selectedDriver.bestLap,
              } : undefined}
              showSpeedHeatmap={true}
            />
          </TabsContent>

          <TabsContent value="battle">
            <Card className="p-6 bg-background/95 backdrop-blur border-primary/20 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Driver Battle Mode</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Compare two drivers side-by-side in 3D. Watch their ghost cars run their best laps simultaneously to see exactly where time is gained or lost.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-foreground">How to use:</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Select two drivers from the dropdowns</li>
                  <li>2. Compare their best lap times and see the time delta</li>
                  <li>3. Hit play to watch both ghost cars simultaneously</li>
                  <li>4. Use the timeline scrubber to analyze specific corners</li>
                  <li>5. Blue car = Driver 1, Red car = Driver 2</li>
                </ol>
              </div>
            </Card>

            <DriverBattle3D drivers={driverStats} />
          </TabsContent>

          <TabsContent value="strategy">
            <Card className="p-6 bg-background/95 backdrop-blur border-primary/20 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-foreground">3D Strategy Simulation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize different pit stop strategies in 3D. See the impact of pit timing, tyre degradation, and fuel load on lap times.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-foreground">Strategy Options:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Early Pit:</strong> Stop early for fresh tyres, longer stint on new rubber</li>
                  <li>• <strong>Standard Pit:</strong> Baseline strategy with neutral timing</li>
                  <li>• <strong>Late Pit:</strong> Maximize tyre life, risk degradation for track position</li>
                  <li>• <strong>Two-Stop:</strong> Aggressive strategy with multiple fresh tyre sets</li>
                </ul>
              </div>
            </Card>

            <Strategy3DSim />
          </TabsContent>

          <TabsContent value="report">
            <Card className="p-6 bg-background/95 backdrop-blur border-primary/20 mb-6">
              <h3 className="text-lg font-semibold mb-2 text-foreground">AI-Powered Driver Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get comprehensive AI-generated performance reports with insights, strengths, weaknesses, and actionable recommendations.
              </p>
              
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Select Driver to Analyze</label>
                <Select value={selectedDriverNumber} onValueChange={setSelectedDriverNumber}>
                  <SelectTrigger className="max-w-md">
                    <SelectValue placeholder="Choose a driver for AI analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverStats.map(driver => (
                      <SelectItem key={driver.number} value={driver.number}>
                        #{driver.number} - {driver.vehicle} ({driver.class})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-semibold mb-2 text-foreground">Report Includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Overall Performance Rating:</strong> 0-100 score based on multiple factors</li>
                  <li>• <strong>Key Insights:</strong> AI-identified patterns in braking, acceleration, and consistency</li>
                  <li>• <strong>Strengths & Weaknesses:</strong> Detailed breakdown of driver capabilities</li>
                  <li>• <strong>Actionable Recommendations:</strong> Specific improvements for lap time gains</li>
                  <li>• <strong>Export Options:</strong> Download as TXT or JSON for further analysis</li>
                </ul>
              </div>
            </Card>

            {selectedDriver ? (
              <DriverReport driver={selectedDriver} />
            ) : (
              <Card className="p-12 text-center bg-background/95 backdrop-blur border-primary/20">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Select a driver above to generate an AI performance report</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
