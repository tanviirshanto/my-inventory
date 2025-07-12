"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonthlySalesPage() {
  const [data, setData] = useState<{ sales: any[]; grandTotal: number } | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/reports/monthly-sales?month=${month}&year=${year}`);
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, [month, year]);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>📊 Monthly Sold Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-24"
            placeholder="Month"
          />
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-32"
            placeholder="Year"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thickness</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Total Sold</TableHead>
              <TableHead>Item Total (৳)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.sales.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.thickness}</TableCell>
                <TableCell>{item.height}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.totalSold}</TableCell>
                <TableCell>{item.totalItemTotal?.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {data?.grandTotal !== undefined && (
              <TableRow className="font-semibold bg-muted">
                <TableCell colSpan={4} className="text-right">
                  Total
                </TableCell>
                <TableCell>{data.grandTotal.toLocaleString()} ৳</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
