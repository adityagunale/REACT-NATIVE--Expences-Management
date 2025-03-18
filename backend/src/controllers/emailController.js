const { sendEmail } = require('../services/emailService');

const sendExpenseReport = async (req, res) => {
  try {
    const { email, reportData } = req.body;

    if (!email || !reportData) {
      return res.status(400).json({ error: 'Email and report data are required' });
    }

    const { subject, content } = reportData;

    const result = await sendEmail(email, subject, content);
    res.json({ success: true, message: 'Report sent successfully', data: result });
  } catch (error) {
    console.error('Error in sendExpenseReport:', error);
    res.status(500).json({ error: 'Failed to send expense report' });
  }
};

module.exports = {
  sendExpenseReport,
}; 