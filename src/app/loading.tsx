import { Loading } from "@/components/ui/loading"

export default function RootLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Loading variant="festival" text="Loading ArmFestHub..." className="min-h-screen" />
        </div>
    )
}
