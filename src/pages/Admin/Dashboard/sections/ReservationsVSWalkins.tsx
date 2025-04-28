import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AreaChart } from 'recharts'
import { Area, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const ReservationsVSWalkins = () => {

    const bookingData = [
        { name: "Jan", Reservations: 300, "Walk-ins": 350 },  // Total: 650
        { name: "Feb", Reservations: 150, "Walk-ins": 400 },  // Total: 685
        { name: "Mar", Reservations: 400, "Walk-ins": 300 },  // Total: 700 (peak)
        { name: "Apr", Reservations: 120, "Walk-ins": 400 },  // Total: 660 (dip)
        { name: "May", Reservations: 380, "Walk-ins": 300 },  // Total: 680 (rise)
        { name: "Jun", Reservations: 210, "Walk-ins": 440 },  // Total: 650
      ];
      

  return (
    <>
    {/* Area chart spanning 3 columns */}
    <Card className="lg:col-span-3">
    <CardHeader>
        <CardTitle>Reservations vs Walk-ins</CardTitle>
        <CardDescription>Monthly comparison over the last 6 months</CardDescription>
    </CardHeader>
    <CardContent className="h-[19rem] ">
        <ChartContainer
        config={{
            Reservations: {
            label: "Reservations",
            color: "hsl(var(--chart-1))",
            },
            "Walk-ins": {
            label: "Walk-ins",
            color: "hsl(var(--chart-2))",
            },
        }}
        // Force ChartContainer to use full height of the card
        style={{ height: "100%", width: "95%" }}
        >
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={bookingData}
            margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <defs>
                <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorWalkins" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 450]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
                type="monotone"
                dataKey="Reservations"
                stroke="#1d4ed8"
                fill="url(#colorReservations)"
            />
            <Area
                type="monotone"
                dataKey="Walk-ins"
                stroke="#f97316"
                fill="url(#colorWalkins)"
            />
            </AreaChart>
        </ResponsiveContainer>
        </ChartContainer>
    </CardContent>
    </Card>
    </>
  )
}

export default ReservationsVSWalkins