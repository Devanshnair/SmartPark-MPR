/**
 * Component to display directions information in a panel
 */

import type React from "react"
import type { DirectionsResult } from "./directions-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Navigation } from "lucide-react"

interface DirectionsPanelProps {
  directions: DirectionsResult | null
  className?: string
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({ directions, className }) => {
  if (!directions || !directions.routes || directions.routes.length === 0) {
    return null
  }

  const route = directions.routes[0]
  const leg = route.legs[0] // For simplicity, we'll just show the first leg

  // Calculate total distance and duration
  const totalDistance = leg.distance.text
  const totalDuration = leg.duration.text

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Directions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {totalDuration}
          </div>
          <div>{totalDistance}</div>
        </div>

        <div className="space-y-4">
          {/* Origin */}
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
            </div>
            <div>
              <p className="font-medium">{leg.start_address.split(",")[0]}</p>
              <p className="text-sm text-muted-foreground">{leg.start_address}</p>
            </div>
          </div>

          {/* Steps */}
          {leg.steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
                <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
              </div>
              <div className="text-sm">
                <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
                <div className="text-xs text-muted-foreground mt-1">
                  {step.distance.text} · {step.duration.text}
                </div>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-3">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
            </div>
            <div>
              <p className="font-medium">{leg.end_address.split(",")[0]}</p>
              <p className="text-sm text-muted-foreground">{leg.end_address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

