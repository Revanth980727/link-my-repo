
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

export const LLMQuery = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [chartType, setChartType] = useState("bar");
  const [selectedColumns, setSelectedColumns] = useState({ x: "", y: "", names: "", values: "" });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const result = await response.json();
      setQueryResult(result);
      
      if (result.columns.length > 0) {
        setSelectedColumns({
          x: result.columns[0] || "",
          y: result.columns[1] || result.columns[0] || "",
          names: result.columns[0] || "",
          values: result.columns[1] || result.columns[0] || ""
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response from the server. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!queryResult || !queryResult.result.length) return null;

    const data = queryResult.result;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedColumns.x} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={selectedColumns.y} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedColumns.x} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={selectedColumns.y} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={selectedColumns.values}
                nameKey={selectedColumns.names}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedColumns.x} />
              <YAxis dataKey={selectedColumns.y} />
              <Tooltip />
              <Scatter fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Data Insights</TabsTrigger>
          <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          <TabsTrigger value="lineage">Data Lineage</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="query">Enter your question</Label>
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about your data..."
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Submit Query"}
                </Button>
              </form>

              {queryResult && (
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Summary:</h3>
                    <p className="text-muted-foreground">{queryResult.summary}</p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          {queryResult.columns.map((col: string) => (
                            <th key={col} className="border border-border p-2 text-left">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.result.map((row: any, index: number) => (
                          <tr key={index}>
                            {queryResult.columns.map((col: string) => (
                              <td key={col} className="border border-border p-2">
                                {String(row[col] || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {queryResult && queryResult.result.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Chart Type</Label>
                      <Select value={chartType} onValueChange={setChartType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                          <SelectItem value="scatter">Scatter Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(chartType === "line" || chartType === "bar" || chartType === "scatter") && (
                      <>
                        <div>
                          <Label>X-Axis</Label>
                          <Select
                            value={selectedColumns.x}
                            onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, x: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {queryResult.columns.map((col: string) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Y-Axis</Label>
                          <Select
                            value={selectedColumns.y}
                            onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, y: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {queryResult.columns.map((col: string) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {chartType === "pie" && (
                      <>
                        <div>
                          <Label>Names</Label>
                          <Select
                            value={selectedColumns.names}
                            onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, names: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {queryResult.columns.map((col: string) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Values</Label>
                          <Select
                            value={selectedColumns.values}
                            onValueChange={(value) => setSelectedColumns(prev => ({ ...prev, values: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {queryResult.columns.map((col: string) => (
                                <SelectItem key={col} value={col}>{col}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6">
                    {renderChart()}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No query results available for visualization. Submit a query in the Data Insights tab first.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Lineage Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Data lineage visualization will be displayed here after submitting a query. 
                This shows the database tables and columns used in your query.
              </p>
              {queryResult && queryResult.used_elements && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Used Elements:</h4>
                  <div className="space-y-2">
                    <div>
                      <strong>Tables:</strong> {queryResult.used_elements.tables?.join(', ') || 'None'}
                    </div>
                    <div>
                      <strong>Columns:</strong> {queryResult.used_elements.columns?.join(', ') || 'None'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
