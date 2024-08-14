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

export { CreateListing };
