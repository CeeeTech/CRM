const Lead = require("../models/lead");
const Course = require("../models/course");
const Branch = require("../models/branch");
const Status = require("../models/status");
const Student = require("../models/student");
const FollowUp = require("../models/followUp");
const { default: mongoose } = require("mongoose");

//get all leads
async function getLeads(req, res) {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Sserver Error" });
  }
}

//get one lead
async function getLead(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No such lead" });
  }

  const lead = await Lead.findById({ _id: id });

  if (!lead) {
    res.status(400).json({ error: "No such lead" });
  }

  res.status(200).json(lead);
}

//add new lead
async function addLead(req, res) {
  const { date, sheduled_to, course_name, branch_name, student_id } = req.body;

  //check if course_name exist in course table
  const course_doucument = await Course.findOne({ name: course_name });
  if (!course_doucument) {
    res.status(400).json({ error: `course not found: ${course_name}` });
  }

  //check if branch_name exist in branch table
  const branch_doucument = await Branch.findOne({ name: branch_name });
  if (!branch_doucument) {
    res.status(400).json({ error: `branch not found: ${branch_name}` });
  }

  //current datetime
  const currentDateTime = new Date();

  //check if student exist in student table
  if (!mongoose.Types.ObjectId.isValid(student_id)) {
    res.status(400).json({ error: "no such student" });
  }

  try {
    const newLead = await Lead.create({
      date,
      sheduled_at: currentDateTime,
      sheduled_to,
      course_id: course_doucument._id,
      branch_id: branch_doucument._id,
      student_id: student_id,
    });
    res.status(200).json(newLead);
  } catch (error) {
    console.log("Error adding leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//update lead
async function updateLead(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ error: "No such lead" });
  }

  const lead = await Lead.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!lead) {
    res.status(400).json({ error: "no such lead" });
  }

  res.status(200).json(lead);
}

// get all leads from database (should retrive details that related to referenced tables and latest follwo up status)
async function getLeadsSummaryDetails(req, res) {
  try {
    const leads = await Lead.find()
      .populate("student_id", "name")
      .populate("course_id", "name")
      .populate("branch_id", "name")
      .populate("counsellor_id", "name")
      .exec();

    const leadsDetails = [];

    for (const lead of leads) {
      // Find the latest follow-up for the current lead
      const latestFollowUp = await FollowUp.findOne({ lead_id: lead._id })
        .sort({ date: -1 })
        .populate("status_id", "name")
        .exec();

      // Process lead and latest follow-up
      const leadDetail = {
        id: lead._id,
        date: lead.date,
        scheduled_at: lead.scheduled_at,
        scheduled_to: lead.scheduled_to,
        student: {
          name: lead.student_id.name,
          contact_no: lead.student_id.contact_no,
        },
        course: lead.course_id.name,
        branch: lead.branch_id.name,
        counsellor: lead.counsellor_id ? lead.counsellor_id.name : null,
        status: latestFollowUp ? latestFollowUp.status_id.name : null,
      };

      leadsDetails.push(leadDetail);
    }

    res.status(200).json(leadsDetails);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getLeads,
  addLead,
  getLead,
  updateLead,
  getLeadsSummaryDetails,
};
