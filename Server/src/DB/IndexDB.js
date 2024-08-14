import mongoose from "mongoose";


// Global handler for unhandled promise rejections
const IndexDb = async () => {
  try {
    const ConnectDBInstance = await mongoose.connect(process.env.MONGOOSE_URI,{   
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n- CONNECTED TO MONGODB FROM INDEXDB`);
    
  } catch (error) {
    console.log("error in mongoDB", error);
    process.exit(1)
  }
};

// 
export default IndexDb


// Global handler for unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1); // Exit process with failure
});

