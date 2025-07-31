'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEventRequests } from '@/hooks/api/useEventRequests'
import { useUpdateEventRequest } from '@/hooks/api/useUpdateEventRequest'
import { useNotification } from '@/contexts/toast-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Mail,
  Building,
  CheckCircle,
  XCircle
} from 'lucide-react'

import type { EventRequest } from '@/hooks/api/useEventRequests'

export default function EventRequestsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const notification = useNotification()
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  // Check permissions
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session?.user || !['MODERATOR', 'SUPER_ADMIN'].includes(session.user.role)) {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  // Fetch event requests
  const {
    data: requestsData,
    isLoading: loading,
    error,
  } = useEventRequests({
    page: currentPage,
    status: statusFilter,
    search: searchTerm,
  })

  const requests = requestsData?.data || []
  const pagination = requestsData?.pagination || null

  // Show error notification when query fails
  useEffect(() => {
    if (error) {
      notification.error('Failed to load requests', error.message)
    }
  }, [error, notification])

  // Handle approve/reject action
  const updateRequestMutation = useUpdateEventRequest()

  const handleAction = () => {
    if (!selectedRequest || !actionType) return
    
    updateRequestMutation.mutate({
      requestId: selectedRequest.id,
      status: actionType === 'approve' ? 'APPROVED' : 'REJECTED',
      reviewNotes: reviewNotes || undefined,
      rejectionReason: actionType === 'reject' ? rejectionReason : undefined,
    }, {
      onSuccess: () => {
        const status = actionType === 'approve' ? 'APPROVED' : 'REJECTED'
        if (status === 'APPROVED') {
          notification.success(
            'Request Approved & Event Created!',
            `Event request has been approved and the event is now live on the platform.`
          )
        } else if (status === 'REJECTED') {
          notification.success(
            `Request Rejected`,
            `Event request has been rejected and organizer has been notified.`
          )
        }
        
        // Close modal and reset states
        setActionModalOpen(false)
        setSelectedRequest(null)
        setActionType(null)
        setReviewNotes('')
        setRejectionReason('')
      },
      onError: (error) => {
        console.error('Update request mutation error:', error)
        notification.error(
          'Action failed',
          error?.message || 'Failed to update the request. Please try again.'
        )
      }
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session?.user || !['MODERATOR', 'SUPER_ADMIN'].includes(session.user.role)) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Event Requests</h1>
        <p className="text-gray-600 mt-2">Review and manage event registration requests</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by event name, organizer, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-auto">
              <Label>Status Filter</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={statusFilter === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('PENDING')}
                  className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'APPROVED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('APPROVED')}
                  className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Button>
                <Button
                  variant={statusFilter === 'REJECTED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('REJECTED')}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejected
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{request.eventName}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{request.organizationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{request.organizerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{request.city}, {request.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{request.expectedAttendance} attendees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{request.isFree ? 'Free Event' : `$${request.ticketPrice}`}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted {formatDate(request.submittedAt)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 md:w-48">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{request.eventName}</DialogTitle>
                        <DialogDescription>
                          Event request details and information
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Organizer Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Organizer Information</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Name:</strong> {request.organizerName}</div>
                            <div><strong>Email:</strong> {request.organizerEmail}</div>
                            <div><strong>Phone:</strong> {request.organizerPhone}</div>
                            <div><strong>Organization:</strong> {request.organizationName}</div>
                            {request.organizationWebsite && (
                              <div><strong>Website:</strong> {request.organizationWebsite}</div>
                            )}
                          </div>
                          {request.organizationDescription && (
                            <div className="mt-2">
                              <strong>Description:</strong>
                              <p className="text-sm text-gray-600 mt-1">{request.organizationDescription}</p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Event Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Event Information</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Category:</strong> {request.category}</div>
                            <div><strong>Status:</strong> {getStatusBadge(request.status)}</div>
                            <div><strong>Date:</strong> {formatDate(request.startDate)} - {formatDate(request.endDate)}</div>
                            <div><strong>Time:</strong> {request.startTime} - {request.endTime}</div>
                            <div><strong>Expected Attendance:</strong> {request.expectedAttendance}</div>
                            <div><strong>Price:</strong> {request.isFree ? 'Free Event' : `$${request.ticketPrice}`}</div>
                            {request.ageRestriction && (
                              <div><strong>Age Restriction:</strong> {request.ageRestriction}</div>
                            )}
                          </div>
                          <div className="mt-2">
                            <strong>Description:</strong>
                            <p className="text-sm text-gray-600 mt-1">{request.eventDescription}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Venue Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Venue Information</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Venue:</strong> {request.venueName}</div>
                            <div><strong>Type:</strong> {request.venueType}</div>
                            <div><strong>Address:</strong> {request.venueAddress}</div>
                            <div><strong>City:</strong> {request.city}, {request.state} {request.zipCode}</div>
                            <div><strong>Country:</strong> {request.country}</div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {request.isAccessible && <Badge variant="secondary">Accessible</Badge>}
                            {request.hasParking && <Badge variant="secondary">Parking Available</Badge>}
                            {request.hasFoodVendors && <Badge variant="secondary">Food Vendors</Badge>}
                            {request.servesAlcohol && <Badge variant="secondary">Alcohol Served</Badge>}
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(request.specialRequirements || request.insuranceInfo || request.emergencyPlan) && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Additional Information</h4>
                              {request.specialRequirements && (
                                <div className="mb-2">
                                  <strong>Special Requirements:</strong>
                                  <p className="text-sm text-gray-600 mt-1">{request.specialRequirements}</p>
                                </div>
                              )}
                              {request.insuranceInfo && (
                                <div className="mb-2">
                                  <strong>Insurance:</strong>
                                  <p className="text-sm text-gray-600 mt-1">{request.insuranceInfo}</p>
                                </div>
                              )}
                              {request.emergencyPlan && (
                                <div className="mb-2">
                                  <strong>Emergency Plan:</strong>
                                  <p className="text-sm text-gray-600 mt-1">{request.emergencyPlan}</p>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {request.hasPermits && <Badge variant="secondary">Permits Obtained</Badge>}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Review Info */}
                        {(request.reviewNotes || request.rejectionReason) && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Review Information</h4>
                              {request.reviewer && (
                                <div className="text-sm mb-2">
                                  <strong>Reviewed by:</strong> {request.reviewer.name} ({request.reviewer.email})
                                </div>
                              )}
                              {request.reviewedAt && (
                                <div className="text-sm mb-2">
                                  <strong>Reviewed at:</strong> {new Date(request.reviewedAt).toLocaleString()}
                                </div>
                              )}
                              {request.reviewNotes && (
                                <div className="mb-2">
                                  <strong>Review Notes:</strong>
                                  <p className="text-sm text-gray-600 mt-1">{request.reviewNotes}</p>
                                </div>
                              )}
                              {request.rejectionReason && (
                                <div className="mb-2">
                                  <strong>Rejection Reason:</strong>
                                  <p className="text-sm text-red-600 mt-1">{request.rejectionReason}</p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {request.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => {
                          setSelectedRequest(request)
                          setActionType('approve')
                          setActionModalOpen(true)
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setSelectedRequest(request)
                          setActionType('reject')
                          setActionModalOpen(true)
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!pagination.hasPrev}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={!pagination.hasNext}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Action Modal */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Event Request' : 'Reject Event Request'}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  You are about to {actionType} the event request for "{selectedRequest.eventName}"
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Add any notes about this review..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>

            {actionType === 'reject' && (
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a clear reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={updateRequestMutation.isPending || (actionType === 'reject' && !rejectionReason.trim())}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {updateRequestMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve Event
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Reject Event
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}