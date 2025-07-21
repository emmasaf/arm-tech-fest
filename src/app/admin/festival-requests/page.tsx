"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, DollarSign, Search, Eye, Check, X, Clock } from "lucide-react"

// Mock data for event requests
const festivalRequests = [
    {
        id: 1,
        eventName: "Summer Music Fest 2024",
        organizerName: "John Smith",
        organizerEmail: "john@musicfest.com",
        organizationName: "Music Events LLC",
        category: "Music",
        startDate: "2024-07-15",
        endDate: "2024-07-17",
        location: "Central Park, NYC",
        expectedAttendance: "1001-5000",
        ticketPrice: "89.00",
        status: "pending",
        submittedAt: "2024-01-15T10:30:00Z",
        description: "A three-day music event featuring indie and alternative artists from around the world.",
    },
    {
        id: 2,
        eventName: "Food & Wine Event",
        organizerName: "Sarah Johnson",
        organizerEmail: "sarah@foodwine.com",
        organizationName: "Culinary Events Co",
        category: "Food",
        startDate: "2024-08-20",
        endDate: "2024-08-22",
        location: "Napa Valley, CA",
        expectedAttendance: "501-1000",
        ticketPrice: "125.00",
        status: "approved",
        submittedAt: "2024-01-10T14:20:00Z",
        description: "A premium food and wine tasting experience with renowned chefs and wineries.",
    },
    {
        id: 3,
        eventName: "Tech Innovation Summit",
        organizerName: "Mike Chen",
        organizerEmail: "mike@techsummit.com",
        organizationName: "Tech Forward Inc",
        category: "Technology",
        startDate: "2024-09-15",
        endDate: "2024-09-16",
        location: "Convention Center, SF",
        expectedAttendance: "5001-10000",
        ticketPrice: "199.00",
        status: "rejected",
        submittedAt: "2024-01-05T09:15:00Z",
        description: "A technology conference showcasing the latest innovations in AI and blockchain.",
        rejectionReason: "Insufficient documentation provided for large-scale event management.",
    },
]

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
}

export default function FestivalRequestsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedRequest, setSelectedRequest] = useState<any>(null)
    const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
    const [reviewNotes, setReviewNotes] = useState("")

    const filteredRequests = festivalRequests.filter((request) => {
        const matchesSearch =
            request.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || request.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleReview = (action: "approve" | "reject") => {
        // In a real app, this would make an API call
        console.log(`${action} event request:`, selectedRequest?.id, reviewNotes)
        setSelectedRequest(null)
        setReviewAction(null)
        setReviewNotes("")
    }

    const getStatusBadge = (status: string) => {
        const statusText = status.charAt(0).toUpperCase() + status.slice(1)
        return (
            <Badge className={statusColors[status as keyof typeof statusColors]}>
                {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                {status === "approved" && <Check className="h-3 w-3 mr-1" />}
                {status === "rejected" && <X className="h-3 w-3 mr-1" />}
                {statusText}
            </Badge>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Event Registration Requests</h1>
                    <p className="text-gray-600">Review and manage event registration applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                    <p className="text-2xl font-bold">{festivalRequests.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {festivalRequests.filter((r) => r.status === "pending").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {festivalRequests.filter((r) => r.status === "approved").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Check className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {festivalRequests.filter((r) => r.status === "rejected").length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <X className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by event name, organizer, or organization..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <Card key={request.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{request.eventName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                      </span>
                                            <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                                                {request.location}
                      </span>
                                            <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                                                {request.expectedAttendance} attendees
                      </span>
                                            <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${request.ticketPrice}
                      </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{request.description}</p>
                                        <div className="flex items-center gap-4 text-sm">
                      <span>
                        <strong>Organizer:</strong> {request.organizerName}
                      </span>
                                            <span>
                        <strong>Organization:</strong> {request.organizationName}
                      </span>
                                            <Badge variant="secondary">{request.category}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {getStatusBadge(request.status)}
                                        <span className="text-xs text-gray-500">{new Date(request.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {request.status === "rejected" && request.rejectionReason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-red-800">
                                            <strong>Rejection Reason:</strong> {request.rejectionReason}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>{request.eventName}</DialogTitle>
                                                <DialogDescription>Event Registration Request Details</DialogDescription>
                                            </DialogHeader>
                                            {selectedRequest && (
                                                <div className="space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-semibold mb-3">Organizer Information</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p>
                                                                    <strong>Name:</strong> {selectedRequest.organizerName}
                                                                </p>
                                                                <p>
                                                                    <strong>Email:</strong> {selectedRequest.organizerEmail}
                                                                </p>
                                                                <p>
                                                                    <strong>Organization:</strong> {selectedRequest.organizationName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold mb-3">Event Details</h4>
                                                            <div className="space-y-2 text-sm">
                                                                <p>
                                                                    <strong>Category:</strong> {selectedRequest.category}
                                                                </p>
                                                                <p>
                                                                    <strong>Expected Attendance:</strong> {selectedRequest.expectedAttendance}
                                                                </p>
                                                                <p>
                                                                    <strong>Ticket Price:</strong> ${selectedRequest.ticketPrice}
                                                                </p>
                                                                <p>
                                                                    <strong>Status:</strong> {getStatusBadge(selectedRequest.status)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold mb-3">Description</h4>
                                                        <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                                                    </div>

                                                    {selectedRequest.status === "pending" && (
                                                        <div className="flex gap-4 pt-4 border-t">
                                                            <Button
                                                                onClick={() => setReviewAction("approve")}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                <Check className="h-4 w-4 mr-2" />
                                                                Approve
                                                            </Button>
                                                            <Button onClick={() => setReviewAction("reject")} variant="destructive">
                                                                <X className="h-4 w-4 mr-2" />
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {reviewAction && (
                                                        <div className="space-y-4 pt-4 border-t">
                                                            <div>
                                                                <Label htmlFor="reviewNotes">
                                                                    {reviewAction === "approve" ? "Approval Notes" : "Rejection Reason"}
                                                                </Label>
                                                                <Textarea
                                                                    id="reviewNotes"
                                                                    value={reviewNotes}
                                                                    onChange={(e) => setReviewNotes(e.target.value)}
                                                                    placeholder={
                                                                        reviewAction === "approve"
                                                                            ? "Add any notes for the organizer..."
                                                                            : "Explain why this request is being rejected..."
                                                                    }
                                                                    rows={3}
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={() => handleReview(reviewAction)}
                                                                    className={
                                                                        reviewAction === "approve"
                                                                            ? "bg-green-600 hover:bg-green-700"
                                                                            : "bg-red-600 hover:bg-red-700"
                                                                    }
                                                                >
                                                                    Confirm {reviewAction === "approve" ? "Approval" : "Rejection"}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setReviewAction(null)
                                                                        setReviewNotes("")
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {request.status === "pending" && (
                                        <>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                <Check className="h-4 w-4 mr-2" />
                                                Quick Approve
                                            </Button>
                                            <Button size="sm" variant="destructive">
                                                <X className="h-4 w-4 mr-2" />
                                                Quick Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredRequests.length === 0 && (
                    <Card>
                        <CardContent className="pt-8 text-center">
                            <p className="text-gray-500">No event requests found matching your criteria.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
