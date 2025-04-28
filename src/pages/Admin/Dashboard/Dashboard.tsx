"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Users from "./sections/Users"
import ReservationsVSWalkins from "./sections/ReservationsVSWalkins"
import CustomerTraffic from "./sections/CustomerTraffic"

export default function Dashboard() {

  return (
    <>
    <div className="md:mx-2 md:my-2 rounded-lg bg-white py-5 px-8 max-md:py-[5.5rem]">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Dashboard</h1>

      {/* Laptop */}
      <div className="ml-0 grid grid-rows-6 grid-cols-[2fr_1fr] items-center gap-6 max-[1420px]:hidden">
        <div className="h-full w-full grid grid-cols-3 justify-evenly gap-3 col-start-1 col-end-2 row-start-1 row-end-3">
          <Card className="pt-4 gap-0">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="text-2xl font-semibold py-4 pb-6">₹12,580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18.2%</span> vs last month
            </p>
          </CardContent>
          </Card>
          <Card className="pt-4 gap-0">
            <CardHeader className="flex flex-row items-center justify-between h-fit">
              <CardTitle className="text-gray-500 font-normal text-sm">Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <div className="text-2xl font-semibold py-4 pb-6">78%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5.1%</span> vs last month
              </p>
            </CardContent>
          </Card>
          <Card className="pt-4 gap-0">
            <CardHeader className="flex flex-row items-center justify-between h-fit">
              <CardTitle className="text-gray-500 font-normal text-sm">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <div className="text-2xl font-semibold py-4 pb-6">1,482</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.3%</span> vs last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="h-full w-full row-start-1 row-end-4 col-start-2 col-end-3">
          <Users />
        </div>
        <div className="h-full w-full gap-4 col-start-1 col-end-2 row-start-3 row-end-12">
          <ReservationsVSWalkins />
        </div>
        <div className="h-full w-full row-start-4 row-end-12 col-start-2 col-end-3">
          <CustomerTraffic />
        </div>
      </div>
      {/* Mobile */}
      <div className="ml-0 grid min-[1100px]:grid-rows-[0.5fr_1fr_2fr] grid-rows-[0.5fr_1fr_1fr_2fr] gap-6 min-[1420px]:hidden">
        <div className="h-full w-full grid grid-cols-3 justify-evenly gap-3 row-start-1 row-end-2 col-span-2">
          <Card className="pt-4 gap-0 col-span-1">
          <CardHeader className="flex flex-row items-center justify-between h-fit">
            <CardTitle className="text-gray-500 font-normal text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-full">
            <div className="text-2xl font-semibold py-4 pb-6">₹12,580</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18.2%</span> vs last month
            </p>
          </CardContent>
          </Card>
          <Card className="pt-4 gap-0 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between h-fit">
              <CardTitle className="text-gray-500 font-normal text-sm">Occupancy Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <div className="text-2xl font-semibold py-4 pb-6">78%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5.1%</span> vs last month
              </p>
            </CardContent>
          </Card>
          <Card className="pt-4 gap-0 col-span-1">
            <CardHeader className="flex flex-row items-center justify-between h-fit">
              <CardTitle className="text-gray-500 font-normal text-sm">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full">
              <div className="text-2xl font-semibold py-4 pb-6">1,482</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.3%</span> vs last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid max-[1100px]:hidden grid-cols-[1.5fr_2fr] gap-4 row-start-2 row-end-3 col-span-2">
          <div className="h-full">
            <Users />
          </div>
          <div className="h-full">
            <CustomerTraffic />
          </div>
        </div>
        <div className="h-full min-[1100px]:hidden col-span-2">
          <Users />
        </div>
        <div className="h-full min-[1100px]:hidden col-span-2">
          <CustomerTraffic />
        </div>
        <div className="h-full w-full row-span-1 col-span-2 ">
          <ReservationsVSWalkins />
        </div>
      </div>
    </div>
    </>
  )
}

