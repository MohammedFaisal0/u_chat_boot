import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    // Allow admin and faculty to view feedback stats
    if (payload.accountType !== "admin" && payload.accountType !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.submitted_at = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [
      totalFeedbacks,
      averageRating,
      ratingDistribution,
      recentFeedbacks,
    ] = await Promise.all([
      Feedback.countDocuments(dateFilter),
      Feedback.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]),
      Feedback.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Feedback.find(dateFilter)
        .populate('student', 'name email academic_id')
        .populate('conversation', 'name')
        .sort({ submitted_at: -1 })
        .limit(10)
        .lean(),
    ]);

    const stats = {
      totalFeedbacks,
      averageRating: averageRating[0]?.avgRating || 0,
      ratingDistribution: ratingDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentFeedbacks,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
