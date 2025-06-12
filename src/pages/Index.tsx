
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DiscrepanciesView } from "@/components/DiscrepanciesView";
import { FraudDetection } from "@/components/FraudDetection";
import { LLMQuery } from "@/components/LLMQuery";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Banking Data Monitoring Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Central dashboard for detecting discrepancies, predicting fraud, and interacting with AI
          </p>
        </header>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="discrepancies">View Discrepancies</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="llm">Ask AI Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discrepancy Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Detect duplicate SSNs, suspicious transactions, and data inconsistencies
                  </p>
                  <Button className="w-full">View Discrepancies</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fraud Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Use ML models to predict fraudulent transactions
                  </p>
                  <Button className="w-full">Check Transaction</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Ask questions about your data using natural language
                  </p>
                  <Button className="w-full">Ask AI</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discrepancies" className="mt-6">
            <DiscrepanciesView />
          </TabsContent>

          <TabsContent value="fraud" className="mt-6">
            <FraudDetection />
          </TabsContent>

          <TabsContent value="llm" className="mt-6">
            <LLMQuery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
