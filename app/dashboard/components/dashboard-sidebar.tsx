"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardSidebar() {
  return (
    <div className="w-80 flex-shrink-0 border-r bg-muted/10 p-6 space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium">Budget</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-2xl font-bold">$5,000.00</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-2xl font-bold">$3,240.00</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium">Time/Money to finish</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-2xl font-bold">$1,760.00</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-medium">Already Spent</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-2xl font-bold">$1,240.00</p>
        </CardContent>
      </Card>
    </div>
  );
}
