import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'

const CustomerTraffic = () => {

  // Data for the radar chart
  const timeOfDayData = [
    { subject: "Afternoon", customers: 160},
    { subject: "Evening", customers: 180 },
    { subject: "Night", customers: 80 },
    { subject: "Morning", customers: 120 },
  ]

  return (
    <>
    {/* Radar chart in the fourth column */}
    <Card>
        <CardHeader>
            <CardTitle>Customer Traffic</CardTitle>
        </CardHeader>
        <CardContent className="h-[15.2rem]">
            <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={timeOfDayData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 200]} />
                <Radar
                    name="Customers"
                    dataKey="customers"
                    stroke="#1d4ed8"
                    fill="#1d4ed8"
                    fillOpacity={0.6}
                    dot={{ r: 4, fillOpacity: 1 }}
                />
                <Tooltip formatter={(value) => [`${value} customers`, "Traffic"]} />
            </RadarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
    </>
  )
}

export default CustomerTraffic