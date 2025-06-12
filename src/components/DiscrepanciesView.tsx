
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DISCREPANCY_TYPES = [
  "Duplicate SSN",
  "Duplicate Contact Information", 
  "Transactions on Inactive Accounts",
  "Multiple Accounts with Same Address",
  "Suspiciously High Transactions",
  "Mismatched Customer and Account Data",
  "Multiple Location Transactions",
  "Unusual Balance Changes",
  "Inconsistent KYC with High Transaction Volumes",
  "Multiple Failed Transactions Followed by Success"
];

export const DiscrepanciesView = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [discrepancyData, setDiscrepancyData] = useState<any>(null);
  const { toast } = useToast();

  const handleDiscrepancyCheck = async (discrepancyType: string) => {
    setLoading(discrepancyType);
    try {
      const response = await fetch("http://localhost:5000/api/discrepancies");
      
      if (!response.ok) {
        throw new Error("Failed to fetch discrepancies");
      }
      
      const data = await response.json();
      const filteredDiscrepancies = data.filter((d: any) => d.type === discrepancyType);
      
      if (filteredDiscrepancies.length > 0) {
        setDiscrepancyData({
          type: discrepancyType,
          details: filteredDiscrepancies[0].details
        });
      } else {
        toast({
          title: "No Discrepancies Found",
          description: `No ${discrepancyType} found in the system.`,
        });
        setDiscrepancyData(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch discrepancy data. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Discrepancy Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISCREPANCY_TYPES.map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => handleDiscrepancyCheck(type)}
                disabled={loading === type}
                className="h-auto p-4 text-left justify-start"
              >
                {loading === type ? "Loading..." : type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {discrepancyData && (
        <Card>
          <CardHeader>
            <CardTitle>Discrepancies for {discrepancyData.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    {Object.keys(discrepancyData.details[0] || {}).map((key) => (
                      <th key={key} className="border border-border p-2 text-left">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {discrepancyData.details.map((row: any, index: number) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, cellIndex: number) => (
                        <td key={cellIndex} className="border border-border p-2">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
