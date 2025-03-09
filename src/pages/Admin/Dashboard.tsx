import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const dailyData = [
  { date: "Mon", occupancy: 65, revenue: 400 },
  { date: "Tue", occupancy: 59, revenue: 380 },
  { date: "Wed", occupancy: 80, revenue: 500 },
  { date: "Thu", occupancy: 81, revenue: 540 },
  { date: "Fri", occupancy: 90, revenue: 580 },
  { date: "Sat", occupancy: 95, revenue: 620 },
  { date: "Sun", occupancy: 75, revenue: 490 },
]

const monthlyData = [
  { month: "Jan", occupancy: 65, revenue: 4000 },
  { month: "Feb", occupancy: 59, revenue: 3800 },
  { month: "Mar", occupancy: 80, revenue: 5000 },
  { month: "Apr", occupancy: 81, revenue: 5400 },
  { month: "May", occupancy: 56, revenue: 3800 },
  { month: "Jun", occupancy: 55, revenue: 3900 },
  { month: "Jul", occupancy: 40, revenue: 3000 },
]

const pieData = [
  { name: "Reserved", value: 65 },
  { name: "Available", value: 35 },
]

const hourlyData = [
  { hour: "6AM", occupancy: 10 },
  { hour: "8AM", occupancy: 45 },
  { hour: "10AM", occupancy: 80 },
  { hour: "12PM", occupancy: 75 },
  { hour: "2PM", occupancy: 70 },
  { hour: "4PM", occupancy: 85 },
  { hour: "6PM", occupancy: 60 },
  { hour: "8PM", occupancy: 30 },
  { hour: "10PM", occupancy: 15 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your parking space analytics and performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,580</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,482</div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2h</div>
            <p className="text-xs text-muted-foreground">+0.5h from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Occupancy</CardTitle>
                <CardDescription>Percentage of parking spots occupied per day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      occupancy: {
                        label: "Occupancy",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <Bar data={dailyData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar dataKey="occupancy" fill="hsl(var(--primary))" radius={4} />
                    </Bar>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Revenue generated per day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <Line data={dailyData} type="monotone">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis unit="$" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </Line>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Occupancy</CardTitle>
                <CardDescription>Percentage of parking spots occupied per month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      occupancy: {
                        label: "Occupancy",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <Bar data={monthlyData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar dataKey="occupancy" fill="hsl(var(--primary))" radius={4} />
                    </Bar>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue generated per month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <Line data={monthlyData} type="monotone">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis unit="$" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </Line>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Occupancy</CardTitle>
                <CardDescription>Percentage of parking spots occupied throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      occupancy: {
                        label: "Occupancy",
                        color: "hsl(var(--primary))",
                      },
                    }}
                  >
                    <Line data={hourlyData} type="monotone">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="occupancy"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                      />
                      <Line type="monotone" dataKey="occupancy" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </Line>
                  </ChartContainer>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Occupancy</CardTitle>
                <CardDescription>Current distribution of parking spots</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

