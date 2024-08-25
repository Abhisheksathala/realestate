import ListingModel from "../Models/ListingModel.js";

const CreateListing = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body to check the input data
    const listing = await ListingModel.create(req.body);
    console.log("Listing created:", listing); // Log the created listing for confirmation
    res.status(200).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    console.error("Error creating listing:", error); // Log the error details
    let errorMessage = "Error creating listing";

    // Handle specific errors
    if (error.name === "ValidationError") {
      errorMessage = "Validation Error: " + error.message;
    } else if (error.name === "MongoError" && error.code === 11000) {
      errorMessage = "Duplicate key error: " + JSON.stringify(error.keyValue);
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message, // Send the error message to the client
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    if (req.user.id !== listing.userRef.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this listing",
      });
    }

    await ListingModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    if (req.user.id !== listing.userRef.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this listing",
      });
    }

    const updatedListing = await ListingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getsearch = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await ListingModel.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const cook = async (req, res) => {};

export { CreateListing, deleteListing, updateListing, getListing };
