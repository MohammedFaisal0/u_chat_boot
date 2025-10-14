// app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Issue from "@/models/Issue";
import ChatbotInstruction from "@/models/ChatbotInstruction";
import Account from "@/models/Account";
import Feedback from "@/models/Feedback";
import FacultyMaterial from "@/models/FacultyMaterial";

export async function GET(request) {
  await dbConnect();

  try {
    // Fetch summary statistics
    const [totalStudents, totalIssues, totalInstructions, totalAccounts, totalFeedbacks, averageRating, totalMaterials, materialsLinkedToBot] =
      await Promise.all([
        Student.countDocuments(),
        Issue.countDocuments(),
        ChatbotInstruction.countDocuments(),
        Account.countDocuments(),
        Feedback.countDocuments(),
        Feedback.aggregate([
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ]),
        FacultyMaterial.countDocuments(),
        ChatbotInstruction.countDocuments({ material: { $exists: true, $ne: null } }),
      ]);

    // Fetch recent issues
    const recentIssues = await Issue.find()
      .sort({ time_sent: -1 })
      .limit(5)
      .lean();

    // Fetch issue statistics
    const issueStats = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Fetch student registration trend (last 7 days) - using _id timestamp
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const registrationTrend = await Student.aggregate([
      {
        $addFields: {
          createdAt: { $toDate: "$_id" }
        }
      },
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fetch top 5 most active students (based on number of chats)
    const topActiveStudents = await Student.aggregate([
      { $unwind: "$chats" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          chatCount: { $sum: 1 },
        },
      },
      { $sort: { chatCount: -1 } },
      { $limit: 5 },
    ]);

    // Fetch materials linked to bot
    const materialsLinkedToBotDetails = await ChatbotInstruction.find({ material: { $exists: true, $ne: null } })
      .populate('material', 'title course topic')
      .limit(5)
      .lean();

    // Fetch material statistics
    const materialStats = await FacultyMaterial.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Fetch chat activity over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const chatActivity = await Student.aggregate([
      { $unwind: "$chats" },
      { $match: { "chats.time_started": { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$chats.time_started" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      summary: [
        { title: "Total Students", value: totalStudents, icon: "Users" },
        { title: "Total Issues", value: totalIssues, icon: "AlertCircle" },
        {
          title: "Total Instructions",
          value: totalInstructions,
          icon: "BookOpen",
        },
        { title: "Total Materials", value: totalMaterials, icon: "BookOpen" },
        { title: "Materials Linked to Bot", value: materialsLinkedToBot, icon: "BookOpen" },
        { title: "Total Accounts", value: totalAccounts, icon: "UserCheck" },
        { title: "Total Feedbacks", value: totalFeedbacks, icon: "Star" },
        { 
          title: "Avg Rating", 
          value: averageRating[0]?.avgRating ? averageRating[0].avgRating.toFixed(1) : "0.0", 
          icon: "Star" 
        },
      ],
      recentIssues: recentIssues.map((issue) => ({
        id: issue._id,
        title:
          issue.details.substring(0, 50) +
          (issue.details.length > 50 ? "..." : ""),
        timestamp: issue.time_sent,
        status: issue.status,
      })),
      issueStats,
      registrationTrend,
      topActiveStudents: topActiveStudents.map((student) => ({
        id: student._id,
        name: student.name,
        chatCount: student.chatCount,
      })),
      materialsLinkedToBotDetails: materialsLinkedToBotDetails.map((instruction) => ({
        id: instruction._id,
        title: instruction.title,
        materialTitle: instruction.material?.title || "Unknown",
        course: instruction.material?.course || "Unknown",
        topic: instruction.material?.topic || "Unknown",
      })),
      materialStats,
      chatActivity,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
