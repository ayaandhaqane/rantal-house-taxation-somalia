const mongoose = require('mongoose');
const District = require('../models/District');
const User     = require('../models/User');
const Message  = require('../models/Message');
const TaxCollection = require('../models/TaxCollection');
const Citizen = require('../models/Citizen');  // Assuming you have a Citizen model


// Create message
exports.createMessage = async (req, res) => {
  try {
    const { title, content, districtId, messageType, recipientGroup } = req.body;
    
    // Ensure sender is the currently authenticated user
    const sender = req.user._id;  // This should be available if you're using authentication middleware

    let messageRecipients = [];

    // Check message type
    if (messageType === "overdue") {
      // Get all citizens in the district who have overdue or unpaid taxes
      const unpaidCitizens = await TaxCollection.find({
        district_id: districtId,
        status: { $in: ['unpaid', 'overdue'] }
      }).populate('citizen_id');  // Populate citizen_id to get citizen details

      // Map the unpaid citizens to get their information
      messageRecipients = unpaidCitizens.map((taxCollection) => {
        return taxCollection.citizen_id;  // Access citizen data through taxCollection
      });

      // Remove duplicate citizens in case of multiple overdue collections for the same citizen
      messageRecipients = [...new Set(messageRecipients)];
    } else if (messageType === "upcoming") {
      // For upcoming reminders, you can send the message to all citizens in the district
      messageRecipients = await Citizen.find({ district_id: districtId });
    }

    // Create the message
    const newMessage = new Message({
      title,
      content,
      messageType,
      district_id: districtId,
      sender,  // Set sender to the currently authenticated user
      recipientGroup,  // Set recipient group (All Citizens or Unpaid)
      recipients: messageRecipients  // Add the list of recipients
    });

    // Save the message
    await newMessage.save();
    res.status(200).json({ message: 'Message created successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating message', error: error.message });
  }
};


// Create message
// exports.createMessage = async (req, res) => {
//   try {
//     const { title, content, districtId, messageType } = req.body;
//     let messageRecipients = [];

//     // Check message type
//     if (messageType === "overdue") {
//       // Get all citizens in the district that are overdue or have unpaid taxes
//       const unpaidCitizens = await TaxCollection.find({
//         district_id: districtId,
//         status: { $in: ['unpaid', 'overdue'] }
//       }).populate('citizen_id');  // Populating citizen_id to get citizen details

//       // Map the unpaid citizens to get their information
//       messageRecipients = unpaidCitizens.map((taxCollection) => {
//         return taxCollection.citizen_id;  // Access citizen data through taxCollection
//       });

//       // Remove duplicate citizens in case of multiple overdue collections for the same citizen
//       messageRecipients = [...new Set(messageRecipients)];
//     } else if (messageType === "upcoming") {
//       // For upcoming reminders, you can send the message to all citizens in the district
//       messageRecipients = await Citizen.find({ district_id: districtId });
//     }

//     // Create the message
//     const newMessage = new Message({
//       title,
//       content,
//       messageType,
//       district_id: districtId,
//       recipients: messageRecipients  // Add the list of recipients
//     });

//     // Save the message
//     await newMessage.save();
//     res.status(200).json({ message: 'Message created successfully', newMessage });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating message', error: error.message });
//   }
// };

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'fullName username role district avatarUrl')
      .sort({ sentAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to load messages', error: error.message });
  }
};

// // Get messages filtered by sender's district
// exports.getMessagesByDistrict = async (req, res) => {
//   try {
//     const district = req.params.district;

//     const messages = await Message.find()
//       .populate({
//         path: 'sender',
//         match: { district: district },
//         select: 'firstName lastName role district avatarUrl'
//       })
//       .sort({ sentAt: -1 });

//     // Remove messages where sender didn't match district (populate with match returns null sender)
//     const filteredMessages = messages.filter(message => message.sender != null);

//     res.json(filteredMessages);
//   } catch (error) {
//     console.error('Failed to get messages by district:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// Updated getMessagesByDistrict controller
// exports.getMessagesByDistrict = async (req, res) => {
//   try {
//     const districtId = req.params.district;

//     // 1. First get the district name
//     const district = await District.findById(districtId).select('district_name name');
//     if (!district) {
//       return res.status(404).json({ message: 'District not found' });
//     }

//     // 2. Find users in this district
//     const usersInDistrict = await User.find({ district: districtId }).select('_id');

//     // 3. Find messages from these users with proper population
//     const messages = await Message.find({
//       sender: { $in: usersInDistrict.map(user => user._id) }
//     })
//     .populate({
//       path: 'sender',
//       select: 'firstName lastName role district avatarUrl',
//       populate: {
//         path: 'district',
//         select: 'district_name name'  // Get district info with sender
//       }
//     })
//     .sort({ sentAt: -1 });

//     // Use consistent district name field (prefer district_name)
//     const districtName = district.district_name || district.name || '';

//     res.json({
//       districtName,  // Include district name in response
//       messages
//     });

//   } catch (error) {
//     console.error('Failed to get messages by district:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// At top of your file add (if not already):

// exports.getMessagesByDistrict = async (req, res) => {
//   try {
//     // 1) Grab & clean up the district ID
//     const districtId = req.params.district.trim();
//     if (!mongoose.Types.ObjectId.isValid(districtId)) {
//       return res.status(400).json({ message: 'Invalid district id' });
//     }

//     // 2) Fetch *all* messages, populating sender.district
//     const all = await Message.find()
//       .populate({
//         path: 'sender',
//         select: 'firstName lastName role district avatarUrl',
//         populate: {
//           path: 'district',
//           select: 'district_name name'
//         }
//       })
//       .sort({ sentAt: -1 });

//     // 3) Filter in JS to only those whose sender.district matches
//     const filtered = all.filter(msg => {
//       // msg.sender may be null if the user was deleted
//       return msg.sender?.district?._id.toString() === districtId;
//     });

//     // 4) Grab the human name from the first populated message, if any
//     let districtName = '';
//     if (filtered.length) {
//       districtName = filtered[0].sender.district.district_name
//                   || filtered[0].sender.district.name
//                   || '';
//     }

//     return res.json({
//       districtName,
//       messages: filtered
//     });
//   } catch (err) {
//     console.error('Failed to get messages by district:', err);
//     return res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };



exports.getMessagesForProperty = async (req, res) => {
  try {
    // const { propertyId } = req.params; // Access propertyId from the URL parameters

    // if (!propertyId) {
    //   return res.status(400).json({ message: "Property ID is required." });
    // }

    // Fetch messages for this property
    const upcomingMessages = await Message.find({
      // property_id: propertyId, // Filter messages by property_id
      messageType: 'upcoming',  // Fetch only 'upcoming' messages
    });

    const overdueMessages = await Message.find({
      // property_id: propertyId, // Filter messages by property_id
      messageType: 'overdue',   // Fetch only 'overdue' messages
    });

    const combinedMessages = [...upcomingMessages, ...overdueMessages];

    if (combinedMessages.length === 0) {
      return res.status(404).json({ message: "No messages found for this property." });
    }

    res.status(200).json(combinedMessages); // Return the combined messages
  } catch (error) {
    console.error("Error fetching messages for property:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMessagesByDistrict = async (req, res) => {
  try {
    const districtId = req.params.district.trim(); // Ensure it's a valid districtId

    // Validate the district ID
    if (!mongoose.Types.ObjectId.isValid(districtId)) {
      return res.status(400).json({ message: 'Invalid district id' });
    }

    const allMessages = await Message.find()
      .populate({
        path: 'sender',
        select: 'fullName username role district avatarUrl',
        populate: {
          path: 'district',
          select: 'district_name name'
        }
      })
      .sort({ sentAt: -1 });

    const filteredMessages = allMessages.filter(msg => msg.sender?.district?._id.toString() === districtId);

    let districtName = '';
    if (filteredMessages.length > 0) {
      districtName = filteredMessages[0].sender.district.district_name || filteredMessages[0].sender.district.name || '';
    }

    res.json({
      districtName,
      messages: filteredMessages,
    });
  } catch (err) {
    console.error('Failed to get messages by district:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Get the latest message sent by the authenticated user
exports.getLatestMessageByUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const latestMessage = await Message.findOne({ sender: req.user._id })
      .sort({ sentAt: -1 })
      .populate('sender', 'firstName lastName role district avatarUrl');

    if (!latestMessage) {
      return res.status(404).json({ message: 'No messages found for user' });
    }

    res.json(latestMessage);
  } catch (error) {
    console.error('Error fetching latest user message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get count of unread messages for current user
// exports.getUnreadMessageCount = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     const count = await Message.countDocuments({
//       recipient: req.user._id,
//       isRead: false
//     });

//     res.json({ count });
//   } catch (error) {
//     console.error('Error counting unread messages:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.createOverdueMessage = async (req, res) => {
//   try {
//     const sender = req.user._id;
//     const senderDistrict = req.user.district;

//     // 1. Hel dhammaan citizen-yada district-kan
//     const citizens = await Citizen.find({ district_id: senderDistrict }).select('_id');

//     // 2. For each citizen, hel tax collection-kiisa ugu dambeeya (most recent)
//     const dueCitizenIds = [];
//     for (const citizen of citizens) {
//       // Hel record-kii ugu dambeeyey
//       const lastTax = await TaxCollection.findOne({ citizen_id: citizen._id })
//         .sort({ due_date: -1 }); // most recent first

//       // Haddii record jiro oo uu overdue/unpaid yahay
//       if (lastTax && ['unpaid', 'overdue'].includes(lastTax.status)) {
//         dueCitizenIds.push(citizen._id.toString());
//       }
//     }

//     if (dueCitizenIds.length === 0) {
//       return res.status(400).json({ message: "No overdue citizens found in your district." });
//     }

//     // 3. Create and send the message
//     const { title, content } = req.body;

//     const newMessage = new Message({
//       title,
//       content,
//       messageType: "overdue",
//       district_id: senderDistrict,
//       sender,
//       recipientGroup: "Citizens with Unpaid Taxes",
//       recipients: dueCitizenIds
//     });

//     await newMessage.save();
//     res.status(201).json({ message: "Overdue message sent successfully", data: newMessage });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const Property = require('../models/Property');
exports.createOverdueMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const senderDistrict = req.user.district;

    // 1. Hel dhamaan properties-ka district-kan
    const properties = await Property.find({ district_id: senderDistrict }).select('_id citizen_id');

    // 2. Property kasta, ka hel TaxCollection kii ugu dambeeyey
    const recipients = [];
    const seenCitizens = new Set();

    for (const property of properties) {
      // Ka hel taxcollection kii ugu dambeeyey property-gaas
      const lastTax = await TaxCollection.findOne({ property_id: property._id })
        .sort({ due_date: -1 }); // ugu dambeeya

      // Hubi in property-ga uu leeyahay taxcollection iyo citizen_id
      if (!lastTax || !property.citizen_id) continue;

      // Haddii uu yahay "paid", SKIP — looma dirin
      if (lastTax.status === "paid") continue;

      // Haddii uu yahay "due", "overdue", "unpaid" — citizen-ka ku dar, property-gaas
      const pairKey = `${property.citizen_id}_${property._id}`;
      if (!seenCitizens.has(pairKey)) {
        seenCitizens.add(pairKey);
        recipients.push({
          citizen_id: property.citizen_id,
          property_id: property._id,
        });
      }
    }

    if (recipients.length === 0) {
      return res.status(400).json({ message: "No citizens with due/overdue/unpaid property tax found in your district." });
    }

    // 3. Create message
    const { title, content } = req.body;
    const newMessage = new Message({
      title,
      content,
      messageType: "overdue",
      district_id: senderDistrict,
      sender,
      recipientGroup: "Citizens With Due/Overdue Properties",
      recipients: recipients.map(r => r.citizen_id),
    });

    await newMessage.save();

    res.status(201).json({
      message: "Overdue message sent successfully",
      recipientsCount: recipients.length,
      recipients,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error in createOverdueMessage:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
