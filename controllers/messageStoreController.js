const MessageStore = require('../models/MessageStore');

// Create and store message (sidii hore)
exports.createMessageStore = async (req, res) => {
  try {
    const { messageType, recipientGroup, title, content } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newMessage = new MessageStore({
      messageType,
      recipientGroup,
      title,
      content,
      createdBy: req.user._id
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message stored successfully', data: newMessage });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all stored messages (now both Admin & User can read all)
exports.getAllMessageStores = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const messages = await MessageStore.find()
      .populate('createdBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching stored messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// ✅ Method 1 - Get latest stored message
// ✅ Method 1 - Get latest stored message based on messageType
exports.getLatestMessageFromStore = async (req, res) => {
  try {
    // Get the messageType from query parameters
    const { messageType } = req.query;
    
    if (!messageType || !['upcoming', 'overdue'].includes(messageType)) {
      return res.status(400).json({ message: 'Invalid or missing message type' });
    }

    // Fetch the latest message based on messageType
    const latestStoredMessage = await MessageStore.findOne({ messageType })
      .populate('createdBy', 'firstName lastName role') // Populate the user who created the message
      .sort({ createdAt: -1 }); // Sort by createdAt to get the latest message

    if (!latestStoredMessage) {
      return res.status(404).json({ message: 'No stored messages found for this type' });
    }

    res.json(latestStoredMessage); // Return the latest stored message
  } catch (error) {
    console.error('Error fetching latest stored message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ✅ Method 2 - Send message from store
exports.sendMessageFromStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const storedMessage = await MessageStore.findById(storeId);
    if (!storedMessage) {
      return res.status(404).json({ message: 'Stored message not found' });
    }

    const newMessage = new Message({
      messageType: storedMessage.messageType,
      recipientGroup: storedMessage.recipientGroup,
      title: storedMessage.title,
      content: storedMessage.content,
      sender: req.user._id
    });

    await newMessage.save();
    await MessageStore.findByIdAndDelete(storeId);  // Optional: Delete after sending

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message from store:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};