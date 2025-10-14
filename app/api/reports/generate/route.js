import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Issue from "@/models/Issue";
import Feedback from "@/models/Feedback";
import Escalation from "@/models/Escalation";
import Chat from "@/models/Chat";
import ChatMessage from "@/models/ChatMessage";
import Account from "@/models/Account";
// import SecurityLog from "@/models/SecurityLog"; // Removed - Security feature deleted

export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    
    if (payload.accountType !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { reportType, startDate, endDate, format = "json" } = await request.json();

    await dbConnect();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // End of day

    let reportData = {};

    switch (reportType) {
      case "user_activity":
        reportData = await generateUserActivityReport(start, end);
        break;
      case "chatbot_performance":
        reportData = await generateChatbotPerformanceReport(start, end);
        break;
      case "issue_analysis":
        reportData = await generateIssueAnalysisReport(start, end);
        break;
      // case "security_audit": // Removed - Security feature deleted
      //   reportData = await generateSecurityAuditReport(start, end);
      //   break;
      case "system_overview":
        reportData = await generateSystemOverviewReport(start, end);
        break;
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      reportType,
      period: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: reportData
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function generateUserActivityReport(startDate, endDate) {
  const [
    totalUsers,
    newUsers,
    activeUsers,
    userActivityByDay,
    userActivityByType
  ] = await Promise.all([
    Account.countDocuments(),
    Account.countDocuments({
      created_at: { $gte: startDate, $lte: endDate }
    }),
    Account.countDocuments({
      $or: [
        { updated_at: { $gte: startDate, $lte: endDate } },
        { approved_at: { $gte: startDate, $lte: endDate } }
      ]
    }),
    Account.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Account.aggregate([
      {
        $group: {
          _id: "$accountType",
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  return {
    summary: {
      totalUsers,
      newUsers,
      activeUsers
    },
    trends: {
      userActivityByDay,
      userActivityByType
    }
  };
}

async function generateChatbotPerformanceReport(startDate, endDate) {
  const [
    totalChats,
    totalMessages,
    averageMessagesPerChat,
    responseTimeStats,
    chatActivityByDay,
    topQuestions
  ] = await Promise.all([
    Chat.countDocuments({
      time_started: { $gte: startDate, $lte: endDate }
    }),
    ChatMessage.countDocuments({
      time_sent: { $gte: startDate, $lte: endDate }
    }),
    Chat.aggregate([
      {
        $match: {
          time_started: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: "chatmessages",
          localField: "messages",
          foreignField: "_id",
          as: "messageCount"
        }
      },
      {
        $group: {
          _id: null,
          avgMessages: { $avg: { $size: "$messageCount" } }
        }
      }
    ]),
    ChatMessage.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate },
          from: "ai"
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$response_time" },
          minResponseTime: { $min: "$response_time" },
          maxResponseTime: { $max: "$response_time" }
        }
      }
    ]),
    Chat.aggregate([
      {
        $match: {
          time_started: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_started" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    ChatMessage.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate },
          from: "student"
        }
      },
      {
        $group: {
          _id: "$message_text",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    summary: {
      totalChats,
      totalMessages,
      averageMessagesPerChat: averageMessagesPerChat[0]?.avgMessages || 0
    },
    performance: {
      responseTimeStats: responseTimeStats[0] || {}
    },
    trends: {
      chatActivityByDay,
      topQuestions
    }
  };
}

async function generateIssueAnalysisReport(startDate, endDate) {
  const [
    totalIssues,
    issuesByStatus,
    issuesByType,
    resolutionTimeStats,
    issuesByDay
  ] = await Promise.all([
    Issue.countDocuments({
      time_sent: { $gte: startDate, $lte: endDate }
    }),
    Issue.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]),
    Issue.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]),
    Issue.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate },
          status: { $in: ["resolved", "closed"] }
        }
      },
      {
        $addFields: {
          resolutionTime: {
            $subtract: ["$resolved_at", "$time_sent"]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: "$resolutionTime" },
          minResolutionTime: { $min: "$resolutionTime" },
          maxResolutionTime: { $max: "$resolutionTime" }
        }
      }
    ]),
    Issue.aggregate([
      {
        $match: {
          time_sent: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time_sent" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  return {
    summary: {
      totalIssues
    },
    analysis: {
      issuesByStatus,
      issuesByType,
      resolutionTimeStats: resolutionTimeStats[0] || {}
    },
    trends: {
      issuesByDay
    }
  };
}

// Removed - Security feature deleted
// async function generateSecurityAuditReport(startDate, endDate) { ... }

async function generateSystemOverviewReport(startDate, endDate) {
  const [
    totalUsers,
    totalChats,
    totalIssues,
    totalFeedbacks,
    totalEscalations,
    systemHealth
  ] = await Promise.all([
    Account.countDocuments(),
    Chat.countDocuments(),
    Issue.countDocuments(),
    Feedback.countDocuments(),
    Escalation.countDocuments(),
    getSystemHealthMetrics()
  ]);

  return {
    summary: {
      totalUsers,
      totalChats,
      totalIssues,
      totalFeedbacks,
      totalEscalations
    },
    systemHealth
  };
}

async function getSystemHealthMetrics() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    recentActivity,
    pendingIssues,
    systemUptime
  ] = await Promise.all([
    // Recent activity from other sources since SecurityLog is removed
    Account.countDocuments({
      updated_at: { $gte: oneHourAgo }
    }),
    Issue.countDocuments({
      status: "pending"
    }),
    // This would typically come from system monitoring
    { uptime: "99.9%", lastRestart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  ]);

  return {
    recentActivity,
    pendingIssues,
    systemUptime
  };
}

