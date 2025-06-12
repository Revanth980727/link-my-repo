
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const FraudDetection = () => {
  const [formData, setFormData] = useState({
    account_id: "",
    transaction_amount: "",
    transaction_type: "",
    transaction_date: "",
    merchant_location: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/fraud_detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          account_id: parseInt(formData.account_id),
          transaction_amount: parseFloat(formData.transaction_amount),
          transaction_type: formData.transaction_type,
          transaction_date: formData.transaction_date,
          merchant_location: formData.merchant_location
        })
      });

      if (!response.ok) {
        throw new Error("Failed to process fraud detection");
      }

      const result = await response.json();
      
      if (result.prediction) {
        toast({
          title: "Fraudulent Transaction Detected!",
          description: `Discrepancy Type: ${result.discrepancy_type}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Transaction is Legitimate",
          description: `Discrepancy Type: ${result.discrepancy_type}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process the request. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Fraud Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account_id">Account ID</Label>
            <Input
              id="account_id"
              type="number"
              value={formData.account_id}
              onChange={(e) => setFormData(prev => ({ ...prev, account_id: e.target.value }))}
              required
              min="0"
              step="1"
            />
          </div>

          <div>
            <Label htmlFor="transaction_amount">Transaction Amount</Label>
            <Input
              id="transaction_amount"
              type="number"
              value={formData.transaction_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_amount: e.target.value }))}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="transaction_type">Transaction Type</Label>
            <Select
              value={formData.transaction_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, transaction_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online Purchase">Online Purchase</SelectItem>
                <SelectItem value="ATM Withdrawal">ATM Withdrawal</SelectItem>
                <SelectItem value="POS Payment">POS Payment</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transaction_date">Transaction Date</Label>
            <Input
              id="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="merchant_location">Merchant Location</Label>
            <Input
              id="merchant_location"
              type="text"
              value={formData.merchant_location}
              onChange={(e) => setFormData(prev => ({ ...prev, merchant_location: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
