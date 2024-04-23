const { validationResult } = require("express-validator");
const database = require("../connect/database");

function generateResponse(messageText) {
  const lowerText = messageText.toLowerCase();

  if (lowerText.includes("hello")) {
    return "Hello! How can I help you today?";
  } else if (lowerText.includes("help")) {
    return "Sure, what do you need help with?";
  } else if (lowerText.includes("artist")) {
    return "You can view our top artists on our website or ask me for specific artist details!";
  } else if (lowerText.includes("appointment") || lowerText.includes("book")) {
    return "I can help you with booking an appointment. Which service are you interested in?";
  } else if (
    lowerText.includes("festive,casual,bridal") ||
    lowerText.includes("makeover")
  ) {
    return "You can view categories to find the related makeover..";
  } else {
    return "I'm not sure how to respond to that. Can you try asking differently?";
  }
}

// Add a new message and respond
exports.addMessage = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { SessionID, SenderType, MessageText, Intent, Response, Context } =
    req.body;
  const responseText = generateResponse(MessageText); // Use the function to generate a response

  const insertQuery = `
        INSERT INTO chatbot (SessionID, SenderType, MessageText, Intent, Response, Context)
        VALUES (?, ?, ?, ?, ?, ?)`;

  database.query(
    insertQuery,
    [SessionID, SenderType, MessageText, Intent, responseText, Context], // Insert the generated response
    (err, result) => {
      if (err) {
        console.error("Error adding message:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      res.status(201).json({
        message: "Message added successfully",
        response: responseText,
        messageId: result.insertId,
      });
    }
  );
};
// Get messages by SessionID
exports.getMessagesBySessionId = (req, res) => {
  const { SessionID } = req.params;

  if (!SessionID) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  const query = "SELECT * FROM chatbot WHERE SessionID = ?";

  database.query(query, [SessionID], (err, results) => {
    if (err) {
      console.error("Error fetching messages by SessionID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res
        .status(404)
        .json({ message: "No messages found for the given Session ID" });
    }
  });
};
