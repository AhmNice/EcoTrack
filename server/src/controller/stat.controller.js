import { Report } from "../model/Report.js"
import { User } from "../model/User.js"

export const userStats = async (req, res) => {
  const { user_id } = req.body
  try {
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required"
      })
    }

    const myReports = await Report.countByUserId(user_id)
    const pendingReports = await Report.countByStatus("pending",user_id)
    const resolved = await Report.countByStatus("resolved",user_id)

    return res.status(200).json({
      success: true,
      message: "User stats fetched successfully",
      stats: {
        my_reports: myReports,
        pending_reports: pendingReports,
        resolved_reports: resolved
      }
    })
  } catch (error) {
    console.error("❌ Error fetching user stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics"
    })
  }
}


export const adminStats = async (req, res) => {
  try {
    const userStats = await User.getStatistics()
    const reportStats = await Report.getStatistics()
    const roleStats = await User.getStatisticsByRole()

    return res.status(200).json({
      success: true,
      message: "Admin statistics fetched successfully",
      data: {
        user_statistics: userStats,
        report_statistics: reportStats,
        role_statistics: roleStats
      }
    })
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics"
    })
  }
}

export const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countTotal()
    const activeUsers = await User.countActive()
    const totalReports = await Report.countTotal()
    const pendingReports = await Report.countByStatus("pending")
    const criticalReports = await Report.countBySeverity("critical")
    const resolvedReports = await Report.countByStatus("resolved")

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        users: {
          total: totalUsers,
          active: activeUsers
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          critical: criticalReports,
          resolved: resolvedReports
        }
      }
    })
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    })
  }
}

export const reportStats = async (req, res) => {
  try {
    const reportStatistics = await Report.getStatistics()

    return res.status(200).json({
      success: true,
      message: "Report statistics fetched successfully",
      data: reportStatistics
    })
  } catch (error) {
    console.error("❌ Error fetching report stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report statistics"
    })
  }
}

export const userBreakdownStats = async (req, res) => {
  try {
    const totalUsers = await User.countTotal()
    const activeUsers = await User.countActive()
    const inactiveUsers = await User.countInactive()
    const verifiedUsers = await User.countVerified()
    const superAdmins = await User.countSuperAdmins()
    const roleStats = await User.getStatisticsByRole()

    return res.status(200).json({
      success: true,
      message: "User breakdown statistics fetched successfully",
      data: {
        summary: {
          total_users: totalUsers,
          active_users: activeUsers,
          inactive_users: inactiveUsers,
          verified_users: verifiedUsers,
          super_admins: superAdmins
        },
        by_role: roleStats
      }
    })
  } catch (error) {
    console.error("❌ Error fetching user breakdown stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user breakdown statistics"
    })
  }
}
export const reportStatusStats = async (req, res) => {
  try {
    const pendingCount = await Report.countByStatus("pending")
    const inProgressCount = await Report.countByStatus("in_progress")
    const resolvedCount = await Report.countByStatus("resolved")
    const closedCount = await Report.countByStatus("closed")
    const totalReports = await Report.countTotal()

    return res.status(200).json({
      success: true,
      message: "Report status statistics fetched successfully",
      data: {
        total_reports: totalReports,
        by_status: {
          pending: pendingCount,
          in_progress: inProgressCount,
          resolved: resolvedCount,
          closed: closedCount
        },
        percentages: {
          pending_percent: totalReports > 0 ? ((pendingCount / totalReports) * 100).toFixed(2) : 0,
          in_progress_percent: totalReports > 0 ? ((inProgressCount / totalReports) * 100).toFixed(2) : 0,
          resolved_percent: totalReports > 0 ? ((resolvedCount / totalReports) * 100).toFixed(2) : 0,
          closed_percent: totalReports > 0 ? ((closedCount / totalReports) * 100).toFixed(2) : 0
        }
      }
    })
  } catch (error) {
    console.error("❌ Error fetching report status stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report status statistics"
    })
  }
}

export const reportSeverityStats = async (req, res) => {
  try {
    const criticalCount = await Report.countBySeverity("critical")
    const highCount = await Report.countBySeverity("high")
    const mediumCount = await Report.countBySeverity("medium")
    const lowCount = await Report.countBySeverity("low")
    const totalReports = await Report.countTotal()

    return res.status(200).json({
      success: true,
      message: "Report severity statistics fetched successfully",
      data: {
        total_reports: totalReports,
        by_severity: {
          critical: criticalCount,
          high: highCount,
          medium: mediumCount,
          low: lowCount
        },
        percentages: {
          critical_percent: totalReports > 0 ? ((criticalCount / totalReports) * 100).toFixed(2) : 0,
          high_percent: totalReports > 0 ? ((highCount / totalReports) * 100).toFixed(2) : 0,
          medium_percent: totalReports > 0 ? ((mediumCount / totalReports) * 100).toFixed(2) : 0,
          low_percent: totalReports > 0 ? ((lowCount / totalReports) * 100).toFixed(2) : 0
        }
      }
    })
  } catch (error) {
    console.error("❌ Error fetching report severity stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report severity statistics"
    })
  }
}

export const systemStats = async (req, res) => {
  try {
    const userStatistics = await User.getStatistics()
    const reportStatistics = await Report.getStatistics()
    const roleStatistics = await User.getStatisticsByRole()

    // Calculate additional metrics
    const totalUsers = userStatistics.total_users
    const totalReports = reportStatistics.total_reports
    const resolutionRate = totalReports > 0
      ? ((reportStatistics.resolved / totalReports) * 100).toFixed(2)
      : 0

    return res.status(200).json({
      success: true,
      message: "System statistics fetched successfully",
      data: {
        user_statistics: userStatistics,
        report_statistics: reportStatistics,
        role_breakdown: roleStatistics,
        metrics: {
          total_users: totalUsers,
          total_reports: totalReports,
          resolution_rate: `${resolutionRate}%`,
          average_reports_per_user: totalUsers > 0 ? (totalReports / totalUsers).toFixed(2) : 0,
          critical_issues: reportStatistics.critical,
          high_severity_issues: reportStatistics.high
        }
      }
    })
  } catch (error) {
    console.error("❌ Error fetching system stats:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch system statistics"
    })
  }
}