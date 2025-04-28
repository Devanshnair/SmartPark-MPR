import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const Users = () => {

  // Data for the pie chart
  const userTypeData = [
    { name: "Existing Users", value: 85 },
    { name: "New Users", value: 15 },
  ]

  // Colors for the pie chart
  const COLORS = ["#1d4ed8", "#f97316"]

  return (
    <Card className="max-[1420px]:pt-6 pt-4 gap-0 h-full">
        <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="min-[1420px]:text-gray-500 min-[1420px]:font-normal font-medium">Users</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-full items-start">
        <div className="h-full w-full ">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart className="flex">
                <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                >
                {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />

            </PieChart>
            </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">
            <span className="text-red-500">- 1.4%</span> new users vs last month
        </p>
        </CardContent>
  </Card>
  )
}

export default Users