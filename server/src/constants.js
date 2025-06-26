const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const logger = require("./logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const { console } = require("inspector");



// Set up Google Cloud credentials

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
   '/usr/src/app/src/lustrous-bounty-443706-b7-fc7c62d3c244.json'
);

// process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
//    '/home/ubuntu/MaxHome_finial_version/server/src/lustrous-bounty-443706-b7-fc7c62d3c244.json'
// );

const fields = {
   "Buyer Name_001": {
      "type": "string",
      "description": ""
   },
   "Purchase Price": {
      "type": "string",
      "description": "Takes value in dollars and stores a double value",
   },
   "MLS": {
      "type": "number",
      "description": "Takes value and stores in int format"
   },
   "buyer_email": {
      "type": "string",
      "description": "Extracts the email id"
   },
   "Earnest Money": {
      "type": "string",
      "description": "Takes value in dollars and stores a double value"
   },
   "Business Days_1": {
      "type": "string",
      "description": ""
   },
   "Seller's Brokerage": {
      "type": "boolean",
      "description": "Boolean, value true if EMD holder is seller"
   },
   "Buyer's Brokerage": {
      "type": "boolean",
      "description": "Boolean, value true if EMD holder is buyer"
   },
   "As Otherwise Agreed": {
      "type": "boolean",
      "description": "Boolean, value true if EMD holder is third party"
   },
   "Date_2": {
      "type": "string",
      "description": "Closing date which stores a date in MM-DD format"
   },
   "Year_2": {
      "type": "string",
      "description": "Closing year which stores a year in YY format"
   },
   "FHA": {
      "type": "boolean",
      "description": "Boolean, value true if loan type is FHA"
   },
   "VA": {
      "type": "boolean",
      "description": "Boolean, value true if loan type is VA"
   },
   "USDA": {
      "type": "boolean",
      "description": "Boolean, value true if loan type is USDA"
   },
   "Conventional": {
      "type": "boolean",
      "description": "Boolean, value true if loan type is Conventional"
   },
   "Percent of Purchase Price": {
      "type": "string",
      "description": "Takes percentage and stores int value (0 if none)"
   },
   "Buyer Initials_33": {
      "type": "string",
      "description": ""
   },
   "Buyer Initials_34": {
      "type": "string",
      "description": ""
   },
   "Seller Initials_33": {
      "type": "string",
      "description": ""
   },
   "Seller Initials_34": {
      "type": "string",
      "description": ""
   },
   "Address of Buyer's Real Estate": {
      "type": "string",
      "description": ""
   },
   // "Has_1": {
   //     "type": "boolean",
   //     "description": "True if buyer Has received a completed Illinois Residential Real Property Disclosure"
   // },
   // "Has Not_1": {
   //     "type": "boolean",
   //     "description": "True if buyer Has not received a completed Illinois Residential Real Property Disclosure"
   // },
   // "Has_2": {
   //     "type": "boolean",
   //     "description": "True if has received the EPA Pamphlet, Protect Your Family From Lead In Your Home"
   // },
   // "Has Not_2": {
   //     "type": "boolean",
   //     "description": "True if has not received the EPA Pamphlet, Protect Your Family From Lead In Your Home"
   // },
   // "Has_3": {
   //     "type": "boolean",
   //     "description": "True if has received a Lead-Based Paint Disclosure"
   // },
   // "Has Not_3": {
   //     "type": "boolean",
   //     "description": "True if has not received a Lead-Based Paint Disclosure"
   // },
   // "Has_4": {
   //     "type": "boolean",
   //     "description": "True if has received the IEMA, Radon Testing Guidelines for Real Estate Transactions"
   // },
   // "Has Not_4": {
   //     "type": "boolean",
   //     "description": "True if has not received the IEMA, Radon Testing Guidelines for Real Estate Transactions"
   // },
   // "Has_5": {
   //     "type": "boolean",
   //     "description": "True if has received the Disclosure of Information on Radon Hazards. "
   // },
   // "Has Not_5": {
   //     "type": "boolean",
   //     "description": "True if has not received the Disclosure of Information on Radon Hazards. "
   // },
   // "Percent of Full Year Tax Bill": {
   //     "type": "string",
   //     "description": "Percent of Full Year Tax Bill"
   // },
   //  "Has_6": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Has Not_6": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is_3": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is Not_3": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is_4": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is not_4": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is_5": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   //  "Is Not_5": {
   //      "type": "boolean",
   //      "description": ""
   //  },
   "Date_3": {
      "type": "string",
      "description": ""
   },
   "Year_3": {
      "type": "string",
      "description": ""
   },
   "Date_4": {
      "type": "string",
      "description": ""
   },
   "Year_4": {
      "type": "string",
      "description": ""
   },
   "Credit Amount": {
      "type": "string",
      "description": "Credit amount"
   },
   "All_Cash_Deal": {
      "type": "boolean",
      "description": "True if the deal is all cash with no loan, skips percentage of purchase price field."
   },
   // "All_Cash_Deal_with_Mortage": {
   //     "type": "boolean",
   //     "description": "True if the deal is all cash but mortage is allowed"
   // },
   "waive_off_home_inspection": {
      "type": "boolean",
      "description": "True if they want to waive off home inspection"
   },
   "Seller Name_001": {
      "type": "text",
      "description": "The name of the seller in the real estate transaction."
   },
   "Dual Agency Check": {
      "type": "checkbox",
      "description": "Indicates whether dual agency applies to the transaction."
   },
   "Approx. Lot Size or Acreage": {
      "type": "text",
      "description": "The approximate size of the lot or acreage of the property."
   },
   "Address": {
      "type": "text",
      "description": "The address of the property being sold."
   },
   "Permanent Index Numbers": {
      "type": "text",
      "description": "The permanent index numbers associated with the property."
   },
   "Single Family Attached": {
      "type": "checkbox",
      "description": "Indicates whether the property is a single-family attached dwelling."
   },
   "Single Family Detached": {
      "type": "checkbox",
      "description": "Indicates whether the property is a single-family detached dwelling."
   },
   "MultiUnit": {
      "type": "checkbox",
      "description": "Indicates whether the property is a multi-unit dwelling."
   },
   "Number of Parking Spaces": {
      "type": "number",
      "description": "The number of parking spaces included with the property."
   },
   "Identified as Spaces": {
      "type": "text",
      "description": "The identification of the parking spaces (e.g. space numbers)."
   },
   "Location": {
      "type": "text",
      "description": "The location of the parking spaces."
   },
   "Deeded Space": {
      "type": "checkbox",
      "description": "Indicates whether the parking space is deeded."
   },
   "Deeded Space PIN": {
      "type": "text",
      "description": "The PIN associated with the deeded parking space."
   },
   "Limited Common Element": {
      "type": "checkbox",
      "description": "Indicates whether the parking space is a limited common element."
   },
   "Assigned Space": {
      "type": "checkbox",
      "description": "Indicates whether the parking space is assigned."
   },
   "Number of Designated Storage Spaces": {
      "type": "number",
      "description": "The number of designated storage spaces included with the property."
   },
   "Identified as Spaces_2": {
      "type": "text",
      "description": "The identification of the storage spaces (e.g. space numbers)."
   },
   "Location_2": {
      "type": "text",
      "description": "The location of the storage spaces."
   },
   "Deeded Space_2": {
      "type": "checkbox",
      "description": "Indicates whether the storage space is deeded."
   },
   "Deeded Space PIN_2": {
      "type": "text",
      "description": "The PIN associated with the deeded storage space."
   },
   "Limited Common Element_2": {
      "type": "checkbox",
      "description": "Indicates whether the storage space is a limited common element."
   },
   "Assigned Space_2": {
      "type": "checkbox",
      "description": "Indicates whether the storage space is assigned."
   },
   "Refrigerator_1": {
      "type": "checkbox",
      "description": "Indicates whether a refrigerator is included with the property."
   },
   "Refrigerator_2": {
      "type": "checkbox",
      "description": "Indicates whether a refrigerator is included with the property ( duplicate field)."
   },
   "Wine/Beverage Refrigerator_1": {
      "type": "checkbox",
      "description": "Indicates whether a wine/beverage refrigerator is included with the property."
   },
   "Wine/Beverage Refrigerator_2": {
      "type": "checkbox",
      "description": "Indicates whether a wine/beverage refrigerator is included with the property (duplicate field)."
   },
   "Light Fixtures_1": {
      "type": "checkbox",
      "description": "Indicates whether light fixtures are included with the property."
   },
   "Light Fixtures_2": {
      "type": "checkbox",
      "description": "Indicates whether light fixtures are included with the property (duplicate field)."
   },
   "Fireplace Gas Log(s)_1": {
      "type": "checkbox",
      "description": "Indicates whether a fireplace gas log is included"
   },
   "Fireplace Gas Log(s)_2": {
      "type": "checkbox",
      "description": "Indicates whether a fireplace gas log is included with the property (duplicate field)."
   },
   "Oven/Range/Stove_1": {
      "type": "checkbox",
      "description": "Indicates whether an oven/range/stove is included with the property."
   },
   "Oven/Range/Stove_2": {
      "type": "checkbox",
      "description": "Indicates whether an oven/range/stove is included with the property (duplicate field)."
   },
   "Sump Pump_1": {
      "type": "checkbox",
      "description": "Indicates whether a sump pump is included with the property."
   },
   "Sump Pump_2": {
      "type": "checkbox",
      "description": "Indicates whether a sump pump is included with the property (duplicate field)."
   },
   "Built-in/attached shelving_1": {
      "type": "checkbox",
      "description": "Indicates whether built-in/attached shelving is included with the property."
   },
   "Built-in/attached shelving_2": {
      "type": "checkbox",
      "description": "Indicates whether built-in/attached shelving is included with the property (duplicate field)."
   },
   "Smoke Detectors_1": {
      "type": "checkbox",
      "description": "Indicates whether smoke detectors are included with the property."
   },
   "Smoke Detectors_2": {
      "type": "checkbox",
      "description": "Indicates whether smoke detectors are included with the property (duplicate field)."
   },
   "Microwave_1": {
      "type": "checkbox",
      "description": "Indicates whether a microwave is included with the property."
   },
   "Microwave_2": {
      "type": "checkbox",
      "description": "Indicates whether a microwave is included with the property (duplicate field)."
   },
   "Water Softener_1": {
      "type": "checkbox",
      "description": "Indicates whether a water softener is included with the property."
   },
   "Water Softener_2": {
      "type": "checkbox",
      "description": "Indicates whether a water softener is included with the property (duplicate field)."
   },
   "Window Treatments_1": {
      "type": "checkbox",
      "description": "Indicates whether window treatments are included with the property."
   },
   "Window Treatments_2": {
      "type": "checkbox",
      "description": "Indicates whether window treatments are included with the property (duplicate field)."
   },
   "Carbon Monoxide_1": {
      "type": "checkbox",
      "description": "Indicates whether carbon monoxide detectors are included with the property."
   },
   "Carbon Monoxide_2": {
      "type": "checkbox",
      "description": "Indicates whether carbon monoxide detectors are included with the property (duplicate field)."
   },
   "Dishwasher_1": {
      "type": "checkbox",
      "description": "Indicates whether a dishwasher is included with the property."
   },
   "Dishwasher_2": {
      "type": "checkbox",
      "description": "Indicates whether a dishwasher is included with the property (duplicate field)."
   },
   "Central Air Conditioning_1": {
      "type": "checkbox",
      "description": "Indicates whether central air conditioning is included with the property."
   },
   "Central Air Conditioning_2": {
      "type": "checkbox",
      "description": "Indicates whether central air conditioning is included with the property (duplicate field)."
   },
   "Satellite Dish_1": {
      "type": "checkbox",
      "description": "Indicates whether a satellite dish is included with the property."
   },
   "Satellite Dish_2": {
      "type": "checkbox",
      "description": "Indicates whether a satellite dish is included with the property (duplicate field)."
   },
   "Invisible Fence System_1": {
      "type": "checkbox",
      "description": "Indicates whether an invisible fence system is included with the property."
   },
   "Invisible Fence System_2": {
      "type": "checkbox",
      "description": "Indicates whether an invisible fence system is included with the property (duplicate field)."
   },
   "Garbage Disposal_1": {
      "type": "checkbox",
      "description": "Indicates whether a garbage disposal is included with the property."
   },
   "Garbage Disposal_2": {
      "type": "checkbox",
      "description": "Indicates whether a garbage disposal is included with the property (duplicate field)."
   },
   "Central Humidifier_1": {
      "type": "checkbox",
      "description": "Indicates whether a central humidifier is included with the property."
   },
   "Central Humidifier_2": {
      "type": "checkbox",
      "description": "Indicates whether a central humidifier is included with the property (duplicate field)."
   },
   "Wall Mounted Brackets_1": {
      "type": "checkbox",
      "description": "Indicates whether wall-mounted brackets are included with the property."
   },
   "Wall Mounted Brackets_2": {
      "type": "checkbox",
      "description": "Indicates whether wall-mounted brackets are included with the property (duplicate field)."
   },
   "Garage Door Opener_1": {
      "type": "checkbox",
      "description": "Indicates whether a garage door opener is included with the property."
   },
   "Garage Door Opener_2": {
      "type": "checkbox",
      "description": "Indicates whether a garage door opener is included with the property (duplicate field)."
   },
   "Trash Compactor_1": {
      "type": "checkbox",
      "description": "Indicates whether a trash compactor is included with the property."
   },
   "Trash Compactor_2": {
      "type": "checkbox",
      "description": "Indicates whether a trash compactor is included with the property (duplicate field)."
   },
   "Central Vac & Equipment_1": {
      "type": "checkbox",
      "description": "Indicates whether central vacuum equipment is included with the property."
   },
   "Central Vac & Equipment_2": {
      "type": "checkbox",
      "description": "Indicates whether central vacuum equipment is included with the property (duplicate field)."
   },
   "Security System_1": {
      "type": "checkbox",
      "description": "Indicates whether a security system is included with the property."
   },
   "Security System_2": {
      "type": "checkbox",
      "description": "Indicates whether a security system is included with the property (duplicate field)."
   },
   "Washer_1": {
      "type": "checkbox",
      "description": "Indicates whether a washer is included with the property."
   },
   "Washer_2": {
      "type": "checkbox",
      "description": "Indicates whether a washer is included with the property (duplicate field)."
   },
   "Tacked Down Carpeting_1": {
      "type": "checkbox",
      "description": "Indicates whether tacked-down carpeting is included with the property."
   },
   "Tacked Down Carpeting_2": {
      "type": "checkbox",
      "description": "Indicates whether tacked-down carpeting is included with the property (duplicate field)."
   },
   "Intercom System_1": {
      "type": "checkbox",
      "description": "Indicates whether an intercom system is included with the property."
   },
   "Intercom System_2": {
      "type": "checkbox",
      "description": "Indicates whether an intercom system is included with the property (duplicate field)."
   },
   "Outdoor Shed_1": {
      "type": "checkbox",
      "description": "Indicates whether an outdoor shed is included with the property."
   },
   "Outdoor Shed_2": {
      "type": "checkbox",
      "description": "Indicates whether an outdoor shed is included with the property (duplicate field)."
   },
   "Dryer_1": {
      "type": "checkbox",
      "description": "Indicates whether a dryer is included with the property."
   },
   "Dryer_2": {
      "type": "checkbox",
      "description": "Indicates whether a dryer is included with the property (duplicate field)."
   },
   "Existing Storms & Screens_1": {
      "type": "checkbox",
      "description": "Indicates whether existing storms and screens are included with the property."
   },
   "Existing Storms & Screens_2": {
      "type": "checkbox",
      "description": "Indicates whether existing storms and screens are included with the property (duplicate field)."
   },
   "Electronic or Media Air Filter_1": {
      "type": "checkbox",
      "description": "Indicates whether an electronic or media air filter is included with the property."
   },
   "Electronic or Media Air Filter_2": {
      "type": "checkbox",
      "description": "Indicates whether an electronic or media air filter is included with the property (duplicate field)."
   },
   "Outdoor Playset_1": {
      "type": "checkbox",
      "description": "Indicates whether an outdoor playset is included with the property."
   },
   "Outdoor Playset_2": {
      "type": "checkbox",
      "description": "Indicates whether an outdoor playset is included with the property (duplicate field)."
   },
   "Attached Gas Grill_1": {
      "type": "checkbox",
      "description": "Indicates whether an attached gas grill is included with the property."
   },
   "Attached Gas Grill_2": {
      "type": "checkbox",
      "description": "Indicates whether an attached gas grill is included with the property (duplicate field)."
   },
   "Window Air Conditioner_1": {
      "type": "checkbox",
      "description": "Indicates whether a window air conditioner is included with the property."
   },
   "Window Air Conditioner_2": {
      "type": "checkbox",
      "description": "Indicates whether a window air conditioner is included with the property (duplicate field)."
   },
   "Backup Generator System_1": {
      "type": "checkbox",
      "description": "Indicates whether a backup generator system is included with the property."
   },
   "Backup Generator System_2": {
      "type": "checkbox",
      "description": "Indicates whether a backup generator system is included with the property (duplicate field)."
   },
   "Planted Vegetation_1": {
      "type": "checkbox",
      "description": "Indicates whether planted vegetation is included with the property."
   },
   "Planted Vegetation_2": {
      "type": "checkbox",
      "description": "Indicates whether planted vegetation is included with the property (duplicate field)."
   },
   "Water Heater_1": {
      "type": "checkbox",
      "description": "Indicates whether a water heater is included with the property."
   },
   "Water Heater_2": {
      "type": "checkbox",
      "description": "Indicates whether a water heater is included with the property (duplicate field)."
   },
   "Ceiling Fan_1": {
      "type": "checkbox",
      "description": "Indicates whether a ceiling fan is included with the property."
   },
   "Ceiling Fan_2": {
      "type": "checkbox",
      "description": "Indicates whether a ceiling fan is included with the property (duplicate field)."
   },
   "Fireplace Screens/Doors/Grates_1": {
      "type": "checkbox",
      "description": "Indicates whether fireplace screens/doors/grates are included with the property."
   },
   "Fireplace Screens/Doors/Grates_2": {
      "type": "checkbox",
      "description": "Indicates whether fireplace screens/doors/grates are included with the property (duplicate field)."
   },
   "Hardscape_1": {
      "type": "checkbox",
      "description": "Indicates whether hardscape is included with the property."
   },
   "Hardscape_2": {
      "type": "checkbox",
      "description": "Indicates whether hardscape is included with the property (duplicate field)."
   },
   "Other Items Included at No Added Value": {
      "type": "text",
      "description": "A list of other items included with the property at no additional cost."
   },
   "Items Not Included": {
      "type": "text",
      "description": "A list of items not included with the property."
   },
   "Items Not in Operating Condition": {
      "type": "text",
      "description": "A list of items not in operating condition."
   },
   "Home Warranty Applies": {
      "type": "checkbox",
      "description": "Indicates whether a home warranty applies to the property."
   },
   "Fixed": {
      "type": "checkbox",
      "description": "Indicates whether the loan has a fixed interest rate."
   },
   "Adjustable": {
      "type": "checkbox",
      "description": "Indicates whether the loan has an adjustable interest rate."
   },
   "Other": {
      "type": "checkbox",
      "description": "Indicates whether the loan is of another type."
   },
   "Define Other": {
      "type": "text",
      "description": "A field to describe the type of loan if 'Other' is selected."
   },
   "Percent of Purchase Price": {
      "type": "percentage",
      "description": "The percentage of the purchase price that the loan will cover."
   },
   "Percent Per Annum": {
      "type": "percentage",
      "description": "The interest rate of the loan, expressed as a percentage per annum."
   },
   "Percent of Full Year Tax Bill": {
      "type": "Numeric",
      "description": "The percentage of the full year tax bill used for proration purposes."
   },
   "HOA Fees": {
      "type": "Currency",
      "description": "The amount of Homeowner Association (HOA) fees per time frame."
   },
   "Time Frame_1": {
      "type": "Text",
      "description": "The time frame for which the HOA fees are paid (e.g., monthly, quarterly, annually)."
   },
   "Master/Umbrella Association Fees": {
      "type": "Currency",
      "description": "The amount of Master/Umbrella Association fees per time frame."
   },
   "Time Frame_2": {
      "type": "Text",
      "description": "The time frame for which the Master/Umbrella Association fees are paid (e.g., monthly, quarterly, annually)."
   },
   "Is_1": {
      "type": "checkbox",
      "description": "Indicates whether there is an unconfirmed pending special assessment affecting the real estate."
   },
   "Is Not_1": {
      "type": "checkbox",
      "description": "Indicates whether there is no unconfirmed pending special assessment affecting the real estate."
   },
   "Is_2": {
      "type": "checkbox",
      "description": "Indicates whether the real estate is located within a Special Assessment Area or Special Service Area."
   },
   "Is Not_2": {
      "type": "checkbox",
      "description": "Indicates whether the real estate is not located within a Special Assessment Area or Special Service Area."
   }, "Has_6": {
      "type": "checkbox",
      "description": "Indicates whether the buyer has entered into a contract to sell their real estate."
   },
   "Has Not_6": {
      "type": "checkbox",
      "description": "Indicates whether the buyer has not entered into a contract to sell their real estate."
   },
   "Is_3": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is subject to a mortgage contingency."
   },
   "Is Not_3": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is not subject to a mortgage contingency."
   },
   "Is_4": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is subject to a real estate sale contingency."
   },
   "Is Not_4": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is not subject to a real estate sale contingency."
   },
   "Is_5": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is subject to a real estate closing contingency."
   },
   "Is Not_5": {
      "type": "checkbox",
      "description": "Indicates whether the contract to sell the buyer's real estate is not subject to a real estate closing contingency."
   },
   "Has_7": {
      "type": "checkbox",
      "description": "Indicates whether the buyer has publicly listed their real estate for sale."
   },
   "Has Not_7": {
      "type": "checkbox",
      "description": "Indicates whether the buyer has not publicly listed their real estate for sale."
   },
   "Shall Publicly List": {
      "type": "checkbox",
      "description": "Indicates the buyer's commitment to publicly list their real estate for sale with a licensed broker."
   },
   "Buyer's Listing Broker Name": {
      "type": "text",
      "description": "Name of the broker representing the buyer in the sale of their real estate."
   },
   "Brokers Address": {
      "type": "text",
      "description": "Address of the buyer's listing broker."
   },
   "Buyer's Listing Broker Phone": {
      "type": "text",
      "description": "Phone number of the buyer's listing broker for contact purposes."
   },
   "Does Not Intend to List": {
      "type": "checkbox",
      "description": "Indicates whether the buyer does not intend to list their real estate for sale."
   }, "Date_3": {
      "type": "date",
      "description": "The date by which the Buyer must have entered into a contract for the sale of their real estate."
   },
   "Year_3": {
      "type": "year",
      "description": "The year corresponding to the date by which the Buyer must have entered into a contract for the sale of their real estate."
   },
   "Date_4": {
      "type": "date",
      "description": "The date by which the Buyer must close the sale of their real estate."
   },
   "Year_4": {
      "type": "year",
      "description": "The year corresponding to the date by which the Buyer must close the sale of their real estate."
   },
   "Hours_1": {
      "type": "number",
      "description": "The number of hours the Buyer has to waive contingencies after receiving a 'kick-out' notice from the Seller."
   },
   "Additional Earnest Money": {
      "type": "currency",
      "description": "The amount of additional earnest money that the Buyer must deposit to waive contingencies. This is also known as second deposit"
   }, "Date_5": {
      "type": "date",
      "description": "The date by which the prior real estate contract must be canceled."
   },
   "Date_1": {
      "type": "date",
      "description": "The date by additional earnest money or 2nd deposite is due."
   },
   
   "Year_1": {
      "type": "year",
      "description": "The Year by additional earnest money or 2nd deposite is due"
   },
   "Year_5": {
      "type": "year",
      "description": "The year corresponding to the cancellation date of the prior real estate contract."
   },
   "Days_3": {
      "type": "number",
      "description": "Another additional number of days related to possession terms."
   },
   "Date_6": {
      "type": "date",
      "description": "The specific date related to possession or other contractual obligations."
   },
   "Year_6": {
      "type": "year",
      "description": "The year corresponding to the date related to possession or other contractual obligations."
   },
   "Post Closing Escrow": {
      "type": "currency",
      "description": "The amount to be held in escrow after closing for various potential costs."
   },
   "Amount Per Day": {
      "type": "currency",
      "description": "The daily amount to be paid for use and occupancy after closing."
   },
   "Attachments": {
      "type": "text",
      "description": "List of attachments that are incorporated into the contract."
   },
   "Attachments_2": {
      "type": "text",
      "description": "Additional list of attachments that are incorporated into the contract."
   },
   "Articles of Agreement for Deed": {
      "type": "checkbox",
      "description": "Indicates whether an Articles of Agreement for Deed is part of the contract."
   },
   "Assumption of Sellers Mortgage": {
      "type": "checkbox",
      "description": "Indicates whether the buyer will assume the seller's mortgage as part of the contract."
   },
   "CommercialInvestment": {
      "type": "checkbox",
      "description": "Indicates whether the property is a commercial investment."
   },
   "Cooperative Apartment": {
      "type": "checkbox",
      "description": "Indicates whether the property is a cooperative apartment."
   },
   "New Construction": {
      "type": "checkbox",
      "description": "Indicates whether the property is new construction."
   },
   "Short Sale": {
      "type": "checkbox",
      "description": "Indicates whether the transaction is a short sale."
   },
   "TaxDeferred Exchange": {
      "type": "checkbox",
      "description": "Indicates whether the transaction involves a tax-deferred exchange."
   },
   "Vacant Land": {
      "type": "checkbox",
      "description": "Indicates whether the property is vacant land."
   },
   "MultiUnit 4 Units or fewer": {
      "type": "checkbox",
      "description": "Indicates whether the property is a multi-unit dwelling with four units or fewer."
   },
   "Interest Bearing Account": {
      "type": "checkbox",
      "description": "Indicates whether an interest-bearing account is part of the transaction."
   },
   "Lease Purchase": {
      "type": "checkbox",
      "description": "Indicates whether the transaction involves a lease purchase agreement."
   },
   "Date of Offer": {
      "type": "date",
      "description": "The date on which the offer to purchase the property is made."
   },
   "DATE OF ACCEPTANCE": {
      "type": "date",
      "description": "The date on which the seller accepts the offer."
   },
   "Print Buyers Names REQUIRED": {
      "type": "text",
      "description": "The printed names of the buyers, required for identification purposes."
   },
   "Address REQUIRED": {
      "type": "text",
      "description": "The address of the buyer, required for the contract."
   },
   "City State Zip REQUIRED": {
      "type": "text",
      "description": "The city, state, and zip code of the buyer's address, required for the contract."
   },
   "Phone_2": {
      "type": "phone",
      "description": "The phone number of the buyer for contact purposes."
   },
   "Buyers Brokerage_2": {
      "type": "text",
      "description": "The name of the buyer's brokerage, if applicable."
   },
   "State License": {
      "type": "text",
      "description": "The state license number of the buyer's real estate agent."
   },
   "Address_8": {
      "type": "text",
      "description": "An additional address field, possibly for the seller or another party."
   },
   "City": {
      "type": "text",
      "description": "The city associated with the address provided."
   },
   "Zip": {
      "type": "text",
      "description": "The zip code associated with the address provided."
   },
   "Buyers Designated Agent": {
      "type": "text",
      "description": "The name of the buyer's designated real estate agent."
   },
   "MLS_3": {
      "type": "text",
      "description": "An additional MLS number, possibly for a different property or listing."
   },
   "State License_3": {
      "type": "text",
      "description": "An additional state license number, possibly for a different agent."
   },
   "Phone_4": {
      "type": "phone",
      "description": "The phone number of the buyer's designated agent."
   },
   "Fax": {
      "type": "text",
      "description": "The fax number for the buyer or their agent."
   },
   "Email_3": {
      "type": "email",
      "description": "The email address of the buyer's designated agent."
   },
   "Buyers Attorney": {
      "type": "text",
      "description": "The name of the buyer's attorney."
   },
   "Email_5": {
      "type": "email",
      "description": "The email address of the buyer's attorney."
   },
   "Address_10": {
      "type": "text",
      "description": "The address of the buyer's attorney."
   },
   "City_3": {
      "type": "text",
      "description": "The city associated with the buyer's attorney's address."
   },
   "State": {
      "type": "text",
      "description": "The state associated with the buyer's attorney's address."
   },
   "Zip_3": {
      "type": "text",
      "description": "The zip code associated with the buyer's attorney's address."
   },
   "Phone_6": {
      "type": "phone",
      "description": "The phone number of the buyer's attorney."
   },
   "Fax_3": {
      "type": "text",
      "description": "The fax number for the buyer's attorney."
   },
   "Mortgage Company": {
      "type": "text",
      "description": "The name of the mortgage company involved in the transaction."
   },
   "Phone_8": {
      "type": "phone",
      "description": "The phone number of the mortgage company."
   },
   "Loan Officer": {
      "type": "text",
      "description": "The name of the loan officer handling the buyer's mortgage."
   },
   "PhoneFax": {
      "type": "text",
      "description": "The combined phone and fax number for the loan officer."
   },
   "Loan Officer Email": {
      "type": "email",
      "description": "The email address of the loan officer."
   },
   "Print Sellers Names REQUIRED": {
      "type": "text",
      "description": "The printed names of the sellers, required for identification purposes."
   },
   "Address REQUIRED_2": {
      "type": "text",
      "description": "The address of the seller, required for the contract."
   },
   "City State Zip REQUIRED_2": {
      "type": "text",
      "description": "The city, state, and zip code of the seller's address, required for the contract."
   },
   "Phone_3": {
      "type": "phone",
      "description": "The phone number of the seller for contact purposes."
   },
   "Email_2": {
      "type": "email",
      "description": "The email address of the seller for communication purposes."
   },
   "Sellers Brokerage_2": {
      "type": "text",
      "description": "The name of the seller's brokerage, if applicable."
   },
   "MLS_2": {
      "type": "text",
      "description": "The Multiple Listing Service number associated with the seller's property."
   },
   "State License_2": {
      "type": "text",
      "description": "The state license number of the seller's real estate agent."
   },
   "Address_9": {
      "type": "text",
      "description": "An additional address field, possibly for the seller's agent or another party."
   },
   "City_2": {
      "type": "text",
      "description": "The city associated with the seller's address."
   },
   "Zip_2": {
      "type": "text",
      "description": "The zip code associated with the seller's address."
   },
   "Sellers Designated Agent": {
      "type": "text",
      "description": "The name of the seller's designated real estate agent."
   },
   "MLS_4": {
      "type": "text",
      "description": "An additional MLS number, possibly for a different property or listing."
   },
   "State License_4": {
      "type": "text",
      "description": "An additional state license number, possibly for a different agent."
   },
   "Phone_5": {
      "type": "phone",
      "description": "The phone number of the seller's designated agent."
   },
   "Fax_2": {
      "type": "text",
      "description": "The fax number for the seller or their agent."
   },
   "Email_4": {
      "type": "email",
      "description": "The email address of the seller's designated agent."
   },
   "Sellers Attorney": {
      "type": "text",
      "description": "The name of the seller's attorney."
   },
   "Email_6": {
      "type": "email",
      "description": "The email address of the seller's attorney."
   },
   "Address_11": {
      "type": "text",
      "description": "The address of the seller's attorney."
   },
   "City_4": {
      "type": "text",
      "description": "The city associated with the seller's attorney's address."
   },
   "State_2": {
      "type": "text",
      "description": "The state associated with the seller's attorney's address."
   },
   "Zip_4": {
      "type": "text",
      "description": "The zip code associated with the seller's attorney's address."
   },
   "Phone_7": {
      "type": "phone",
      "description": "The phone number of the seller's attorney."
   },
   "Fax_4": {
      "type": "text",
      "description": "The fax number for the seller's attorney."
   },
   "HomeownersCondo Association if any": {
      "type": "text",
      "description": "The name of the homeowner's or condo association, if applicable."
   },
   "Phone_9": {
      "type": "phone",
      "description": "The phone number of the homeowner's or condo association."
   },
   "Management CoOther Contact": {
      "type": "text",
      "description": "The name of the management company or other contact related to the property."
   },
   "Phone_10": {
      "type": "phone",
      "description": "The phone number of the management company or other contact."
   },
   "Management CoOther Contact Email": {
      "type": "email",
      "description": "The email address of the management company or other contact."
   },
   "Date_7": {
      "type": "date",
      "description": "An additional date field, possibly for a specific event related to the contract."
   },
   "Year_7": {
      "type": "text",
      "description": "The year associated with the date provided in Date_7."
   },
   "Time/Hour_1": {
      "type": "text",
      "description": "The hour component of the time related to a specific event."
   },
   "Time/Minute_1": {
      "type": "text",
      "description": "The minute component of the time related to a specific event."
   },
   "Time": {
      "type": "text",
      "description": "The complete time associated with a specific event."
   },
   "Date_8": {
      "type": "date",
      "description": "An additional date field, possibly for another event related to the contract."
   },
   "Year_8": {
      "type": "text",
      "description": "The year associated with the date provided in Date_8."
   },
   "Time/Hour_2": {
      "type": "text",
      "description": "The hour component of the time related to another specific event."
   },
   "Time/Minute_2": {
      "type": "text",
      "description": "The minute component of the time related to another specific event."
   },
   "Time_2": {
      "type": "text",
      "description": "The complete time associated with another specific event."
   },
   "Time_2": {
      "type": "text",
      "description": "A duplicate field for the complete time associated with another specific event."
   },
};

const questions = [
   "Welcome to MaxHome Co-Pilot! Let's create an offer! To begin, please provide the Buyer Name(s).",
   "Could you please share the buyer's email?",
   "Could you share the MLS ID?  I will pull the property details for you.",
   "Thank you. What is the purchase price?",
   "How much is the earnest money deposit?",
   "When is the EMD due? (days after acceptance)",
   "Who will hold the EMD? (Seller’s brokerage, Buyer’s brokerage, Third party)",
   "Noted. What is the agreed closing date?",
   "That’s great. Let’s get details on financing. What type of loan is your client taking?  (Conventional, FHA, VA, USDA, Cash)", "What is the loan amount as percent of purchase price?",
   "What is the loan amount as percent of purchase price?",
   "Excellent, I think I have all the standard details. Are there any other details you’d like to include in this contract that are not typical? If not, just say you're done and I will email the contract to you shortly."
];

function transformFields() {
   var s = ""
   for (var i = 0; i < Object.keys(fields).length; i++) {
      field = fields[Object.keys(fields)[i]];
      s += Object.keys(fields)[i] + ", " + field["type"] + ", " + field["description"] + ",\n";
   }
   return s;
}
function transformQuestions(questions) {
   s = "";
   for (var i = 0; i < questions.length; i++) {
      s += questions[i] + "\n";
   }
   return s;
}
const fewshot = [
   { "role": "user", "content": "hi" },
   { "role": "assistant", "content": "{\"response\":\"Welcome to MaxHome Co-Pilot! Let's create an offer! To begin, please provide the Buyer Name(s).\",\"field_value\":\"none\"}" },
   { "role": "user", "content": "John Doe" },
   { "role": "assistant", "content": "{\"response\":\"Noted! The buyer's name is John Doe. Could you please share the buyer's email?\",\"field_value\":{\"Buyer Name_001\":\"John Doe\"}}" },
   { "role": "user", "content": "test@gmail.com" },
   { "role": "assistant", "content": "{\"response\":\"Got it! The buyer's email is test@gmail.com. Could you please share the MLS ID? I’ll retrieve the property details for you.\",\"field_value\":{\"buyer_email\":\"test@gmail.com\"}}" },
   { "role": "user", "content": "234" },
   { "role": "assistant", "content": "{\"response\":\"Thank you! The MLS ID is 234. Could you let me know the purchase price?\",\"field_value\":{\"MLS\":234}}" },
   { "role": "user", "content": "300 dollars" },
   { "role": "assistant", "content": "{\"response\":\"Got it! The purchase price is $300. How much is the earnest money deposit?\",\"field_value\":{\"Purchase Price\":300}}" },
   { "role": "user", "content": "actually, change MLS id to 235" },
   { "role": "assistant", "content": "{\"response\":\"MLS ID 235, Noted. How much is the earnest money deposit?\",\"field_value\":{\"MLS\":235}}" },
   { "role": "user", "content": "400 dollars" },
   { "role": "assistant", "content": "{\"response\":\"Thank you! The earnest money deposit is $400. Could you let me know when the EMD is due (days after acceptance)?\",\"field_value\":{\"Earnest Money\":400}}" },
   { "role": "user", "content": "3 days" },
   { "role": "assistant", "content": "{\"response\":\"Great! The EMD is due in 3 days. Could you let me know who will hold the EMD? (Seller’s brokerage, Buyer’s brokerage, or a Third party)\",\"field_value\":{\"Business Days_1\":\"3\"}}" },
   { "role": "user", "content": "third party" },
   { "role": "assistant", "content": "{\"response\":\"Got it! The EMD will be held by the third party. What is the agreed closing date?\",\"field_value\":{\"As Otherwise Agreed\":true}}" },
   { "role": "user", "content": "12th July, 2024" },
   { "role": "assistant", "content": "{\"response\":\"Perfect! The closing date is 12th July 2024. Let’s move on to the details of financing.. What type of loan is your client taking? (Conventional, FHA, VA, USDA)\",\"field_value\":{\"Date_2\":\"07-12\",\"Year_2\":\"24\"}}" },
   { "role": "user", "content": "va" },
   { "role": "assistant", "content": "{\"response\":\"Loan type is va. What is the loan amount as percent of purchase price?\",\"field_value\":{\"VA\":true}}" },
   { "role": "user", "content": "12%" },
   { "role": "assistant", "content": "{\"response\":\"Excellent! The loan amount is 12%. I believe I have all the standard details now. Are there any other details you’d like to include in this contract that are not typical? If not, just say you're done and I will email the contract to you shortly.\",\"field_value\":{\"Percent of Purchase Price\":12}}" },
   { "role": "user", "content": "I want to change buyer name" },
   { "role": "assistant", "content": "{\"response\":\"What is the modified buyer name?\",\"field_value\":\"none\"}" },
   { "role": "user", "content": "Doe John" },
   { "role": "assistant", "content": "{\"response\":\"Buyer's name Doe John, Great. Would you like any other changes to be made?\",\"field_value\":{\"Buyer Name_001\":\"Doe John\"}}" },
   { "role": "user", "content": "no" },
   { "role": "assistant", "content": "{\"response\":\"none\",\"field_value\":\"none\"}" },
];

const example_string = "For Example:\nHuman: hi\nAI: {\"response\":\"Let's create an offer! To begin, please provide the Buyer Name(s).\",\"field_value\":\"none\"}\nHuman: John Doe\nAI: {\"response\":\"Buyer's Name John Doe. Could you share the MLS ID? I will pull the property details for you.\",\"field_value\":{\"Buyer Name_001\":\"John Doe\"}}\nHuman: 4000\nAI:{\"response\":\" MLS ID 4000. Thank you. How much is the earnest money deposit?\",\"field_value\":{\"MLS\":4000}}";

const field_string = transformFields();

const question_string = transformQuestions(questions);


const sysmsg = `
You are a Realtor Assistant, a conversational AI designed to collect specific data for populating a PDF Offer Contract. Your primary task is to extract the necessary fields and store them in a JSON string format. 

### Response Format:
Respond strictly in the JSON format:
{"response":"response text","field_value":{"(field extracted)":(value given)}}
- If no field or value exists, set "field_value" to "none". 
- Always include the user's last response in the "response" key of the JSON.

### Guidelines:
1. **Field Handling**:
   - Do not add any fields beyond the specified ones in ${field_string}.
   - For the optional fields read the discriptions provided above and auto map them, if not sure about any field ask user.
   - If the user specifies or updates a field, reflect only the most recent field and value pair in "field_value" unless instructed otherwise.
   - Default "field_value" to "none" if no field was provided or updated.

2. **Question Flow**:
   - Always Start by asking the first question which is "Welcome to MaxHome Co-Pilot! Let's create an offer! To begin, please provide the Buyer Name(s)."
   - Ask questions specified in ${question_string} and skip questions whose answeres are been provided.
   - Never skip a question unless the answer is already provided.
   - Before asking a new question, always check the existing answers in mini_dict and skip any questions whose answers are already available.
   - If a user provides multiple answers at once, update the relevant fields and skip the corresponding questions accordingly and give multiple feedback.
   - For skipped questions, continue asking the next unanswered question.
   - Mandatory fields are "Buyer Name_001","Purchase Price","Earnest Money","buyer_email","MLS","Business Days_1", "Seller's Brokerage","Date_2","Year_2" always check then in mini_dict before ending the conversation , if any of the fields are missing ask user to enter them.

3. **Validation & Corrections**:
   - **Email Validation**:
     - Ensure the user's email is in a valid format.
     - If an invalid email is given, ask them to re-enter it.
     - Apply basic email correction (e.g., converting 'Pratyush 203 at the rate gmail.com' to 'pratyush203@gmail.com').
   - **MLS ID**:
     - If MLS ID contains any special characters rremove it.
     - MLS ID should only contains numbers. (e.g., converting '1220-22-1 'to '1220221').
   - **Loan Type**:
     - If the type of loan is specified as "Cash", skip all loan-related questions.
   - **Earnest Money Calculation**:
     - If the earnest money deposit is given as a percentage, calculate its value based on the provided purchase price and show user the calculated value.
     - Always store the earnest money in numbers and not percentage.

4. **Interruption Handling**:
   - If the user interrupts mid-conversation to update a field, handle the change, confirm it, and resume the flow from where it was interrupted.
   - Example:
     {"response":"Which field would you like to change?","field_value":"none"}

5. **Conclusion**:
   - Indicators to end the conversation are 'i am done' or 'done' or 'okay no other changes'
   - At the end of the conversation, respond with:
     {"response":"none","field_value":(last field value taken)}

### Important Notes:
- Always responce hi with "Welcome to MaxHome Co-Pilot! Let's create an offer! To begin, please provide the Buyer Name(s)."
- Never display a list of all fields or describe the fields to the user.
- If agreed closing date year is not mentioned take '2025' as default Year_2 value.
- Always append the user’s last answer when asking the next question.
- Mandatory fields are Buyer's Name, Email, Mls Id, Purchase Price, EMD due, Earnest money deposit, Closing date, Loan type and loan percentage(only if loan type is not cash else you can skip loan percentage) always check these fields are answered before ending the conversation.
- Grouped answers are allowed—update the relevant fields accordingly and skip questions whose answers are already provided.
- Always maintain the strict JSON format in your responses.
- Buyers name and email field is mandatory.
- All the mandatory fields should always be present before ending the conversation, if any of the fields are missing ask user to answer them.
- If user tries to enter something which you dont understand ask user relevent questions to clarify it.
- For Loan type user can enter usda,cash,va and conventional if any of the options is choosen move to the next question always.
- Do not reapeat the same question.
### Fewshots examples: 

`;


function feedValues(mini_dict) {
   // Trim any extra spaces and split the name by spaces
   var fn = "";
   var ln = "";
   const nameParts = mini_dict["Buyer Name_001"]?.trim().split(/\s+/);

   // If only one part (first name) exists, return the first initial
   if (nameParts.length === 1) {
      fn = nameParts[0].charAt(0).toUpperCase();
   }

   // If both first and last name exist, return the initials
   fn = nameParts[0].charAt(0).toUpperCase();
   try {
      ln = nameParts[1]?.charAt(0)?.toUpperCase();
   }
   catch (err) {
      console.log("ERR", err)
   }

   if (mini_dict["All_Cash_Deal"] == true) {
      mini_dict["Buyer Initial_5"] = fn
      mini_dict["Buyer Initial_6"] = ln

   }
   if (mini_dict["waive_off_home_inspection"] == true) {
      mini_dict["Buyer Initial_13"] = fn
      mini_dict["Buyer Initial_14"] = ln
   }

// 1318 E Braymore Circle, Naperville, Illinois 60564
// UnparsedAddress
// DEfault file 1
   const file1 = {
      "file_name": "Multi_Board_Residential_Real_Estate_Contract_7_Fillable.pdf",
      "file_location": "input_pdf/Multi_Board_Residential_Real_Estate_Contract_7_Fillable.pdf",
      "pages": {
         "1": {
            "fields": {
               "Buyer Name_001": {
                  "field_name": "Buyer Name_001",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": "Name of the buyer"
               },
               "Seller Name_001": {
                  "field_name": "Seller Name_001",
                  "field_value": "Akram Adil, Syeda Khan",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,

                  "description": ""
               },
               "Dual Agency Check": {
                  "field_name": "Dual Agency Check",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Approx. Lot Size or Acreage": {
                  "field_name": "Approx. Lot Size or Acreage",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "1318 E Braymore Circle, Naperville, Illinois 60564",
                  "field_type": "text_field",
                  "mls_field": "",
                  "is_price": false,
                  "description": ""
               },
               "Permanent Index Numbers": {
                  "field_name": "Permanent Index Numbers",
                  "field_value": "732412058",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Single Family Attached": {
                  "field_name": "Single Family Attached",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Single Family Detached": {
                  "field_name": "Single Family Detached",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MultiUnit": {
                  "field_name": "MultiUnit",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Number of Parking Spaces": {
                  "field_name": "Number of Parking Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Identified as Spaces": {
                  "field_name": "Identified as Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Location": {
                  "field_name": "Location",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space": {
                  "field_name": "Deeded Space",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space PIN": {
                  "field_name": "Deeded Space PIN",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Limited Common Element": {
                  "field_name": "Limited Common Element",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assigned Space": {
                  "field_name": "Assigned Space",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Number of Designated Storage Spaces": {
                  "field_name": "Number of Designated Storage Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Identified as Spaces_2": {
                  "field_name": "Identified as Spaces_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Location_2": {
                  "field_name": "Location_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space_2": {
                  "field_name": "Deeded Space_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space PIN_2": {
                  "field_name": "Deeded Space PIN_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Limited Common Element_2": {
                  "field_name": "Limited Common Element_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assigned Space_2": {
                  "field_name": "Assigned Space_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Refrigerator_1": {
                  "field_name": "Refrigerator_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": null,
                  "description": ""
               },
               "Refrigerator_2": {
                  "field_name": "Refrigerator_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wine/Beverage Refrigerator_1": {
                  "field_name": "Wine/Beverage Refrigerator_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wine/Beverage Refrigerator_2": {
                  "field_name": "Wine/Beverage Refrigerator_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Light Fixtures_1": {
                  "field_name": "Light Fixtures_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Light Fixtures_2": {
                  "field_name": "Light Fixtures_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fireplace Gas Log(s)_1": {
                  "field_name": "Fireplace Gas Log(s)_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "FireplaceFeatures",
                  "is_price": false,
                  "mls_value": "Gas Log",
                  "description": ""
               },
               "Fireplace Gas Log(s)_2": {
                  "field_name": "Fireplace Gas Log(s)_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Oven/Range/Stove_1": {
                  "field_name": "Oven/Range/Stove_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Range",
                  "description": ""
               },
               "Oven/Range/Stove_2": {
                  "field_name": "Oven/Range/Stove_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sump Pump_1": {
                  "field_name": "Sump Pump_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sump Pump_2": {
                  "field_name": "Sump Pump_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Built-in/attached shelving_1": {
                  "field_name": "Built-in/attached shelving_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Built-in/attached shelving_2": {
                  "field_name": "Built-in/attached shelving_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Smoke Detectors_1": {
                  "field_name": "Smoke Detectors_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Smoke Detectors_2": {
                  "field_name": "Smoke Detectors_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Microwave_1": {
                  "field_name": "Microwave_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Microwave",
                  "description": ""
               },
               "Microwave_2": {
                  "field_name": "Microwave_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Softener_1": {
                  "field_name": "Water Softener_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Softener_2": {
                  "field_name": "Water Softener_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Treatments_1": {
                  "field_name": "Window Treatments_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Treatments_2": {
                  "field_name": "Window Treatments_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Carbon Monoxide_1": {
                  "field_name": "Carbon Monoxide_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Carbon Monoxide_2": {
                  "field_name": "Carbon Monoxide_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Dishwasher_1": {
                  "field_name": "Dishwasher_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Dishwasher",
                  "description": ""
               },
               "Dishwasher_2": {
                  "field_name": "Dishwasher_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Air Conditioning_1": {
                  "field_name": "Central Air Conditioning_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Air Conditioning_2": {
                  "field_name": "Central Air Conditioning_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Satellite Dish_1": {
                  "field_name": "Satellite Dish_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Satellite Dish_2": {
                  "field_name": "Satellite Dish_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Invisible Fence System_1": {
                  "field_name": "Invisible Fence System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Invisible Fence System_2": {
                  "field_name": "Invisible Fence System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garbage Disposal_1": {
                  "field_name": "Garbage Disposal_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Disposal",
                  "description": ""
               },
               "Garbage Disposal_2": {
                  "field_name": "Garbage Disposal_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Humidifier_1": {
                  "field_name": "Central Humidifier_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Humidifier_2": {
                  "field_name": "Central Humidifier_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wall Mounted Brackets_1": {
                  "field_name": "Wall Mounted Brackets_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wall Mounted Brackets_2": {
                  "field_name": "Wall Mounted Brackets_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garage Door Opener_1": {
                  "field_name": "Garage Door Opener_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garage Door Opener_2": {
                  "field_name": "Garage Door Opener_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Trash Compactor_1": {
                  "field_name": "Trash Compactor_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Trash Compactor_2": {
                  "field_name": "Trash Compactor_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Vac & Equipment_1": {
                  "field_name": "Central Vac & Equipment_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Vac & Equipment_2": {
                  "field_name": "Central Vac & Equipment_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Security System_1": {
                  "field_name": "Security System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Security System_2": {
                  "field_name": "Security System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Washer_1": {
                  "field_name": "Washer_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Washer_2": {
                  "field_name": "Washer_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Tacked Down Carpeting_1": {
                  "field_name": "Tacked Down Carpeting_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Tacked Down Carpeting_2": {
                  "field_name": "Tacked Down Carpeting_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Intercom System_1": {
                  "field_name": "Intercom System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Intercom System_2": {
                  "field_name": "Intercom System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Shed_1": {
                  "field_name": "Outdoor Shed_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Shed_2": {
                  "field_name": "Outdoor Shed_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Dryer_1": {
                  "field_name": "Dryer_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Dryer",
                  "description": ""
               },
               "Dryer_2": {
                  "field_name": "Dryer_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Existing Storms & Screens_1": {
                  "field_name": "Existing Storms & Screens_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Existing Storms & Screens_2": {
                  "field_name": "Existing Storms & Screens_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Electronic or Media Air Filter_1": {
                  "field_name": "Electronic or Media Air Filter_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Electronic or Media Air Filter_2": {
                  "field_name": "Electronic or Media Air Filter_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Playset_1": {
                  "field_name": "Outdoor Playset_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Playset_2": {
                  "field_name": "Outdoor Playset_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attached Gas Grill_1": {
                  "field_name": "Attached Gas Grill_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attached Gas Grill_2": {
                  "field_name": "Attached Gas Grill_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Air Conditioner_1": {
                  "field_name": "Window Air Conditioner_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Air Conditioner_2": {
                  "field_name": "Window Air Conditioner_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Backup Generator System_1": {
                  "field_name": "Backup Generator System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Backup Generator System_2": {
                  "field_name": "Backup Generator System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Planted Vegetation_1": {
                  "field_name": "Planted Vegetation_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Planted Vegetation_2": {
                  "field_name": "Planted Vegetation_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Heater_1": {
                  "field_name": "Water Heater_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Heater_2": {
                  "field_name": "Water Heater_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Ceiling Fan_1": {
                  "field_name": "Ceiling Fan_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "OtherEquipment",
                  "is_price": false,
                  "mls_value": "Ceiling Fan(s)",
                  "description": ""
               },
               "Ceiling Fan_2": {
                  "field_name": "Ceiling Fan_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fireplace Screens/Doors/Grates_1": {
                  "field_name": "Fireplace Screens/Doors/Grates_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "FireplaceFeatures",
                  "is_price": false,
                  "mls_value": "Attached Fireplace Doors/Screen",
                  "description": ""
               },
               "Fireplace Screens/Doors/Grates_2": {
                  "field_name": "Fireplace Screens/Doors/Grates_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hardscape_1": {
                  "field_name": "Hardscape_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hardscape_2": {
                  "field_name": "Hardscape_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Other Items Included at No Added Value": {
                  "field_name": "Other Items Included at No Added Value",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Items Not Included": {
                  "field_name": "Items Not Included",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Items Not in Operating Condition": {
                  "field_name": "Items Not in Operating Condition",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Home Warranty Applies": {
                  "field_name": "Home Warranty Applies",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Purchase Price": {
                  "field_name": "Purchase Price",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Credit Amount": {
                  "field_name": "Credit Amount",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Earnest Money": {
                  "field_name": "Earnest Money",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Business Days_1": {
                  "field_name": "Business Days_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Additional Earnest Money": {
                  "field_name": "Additional Earnest Money",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Date_1": {
                  "field_name": "Date_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_1": {
                  "field_name": "Year_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_1": {
                  "field_name": "Buyer Initial_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_2": {
                  "field_name": "Buyer Initial_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_1": {
                  "field_name": "Seller Initial_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_2": {
                  "field_name": "Seller Initial_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "2": {
            "fields": {
               "Seller's Brokerage": {
                  "field_name": "Seller's Brokerage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Brokerage": {
                  "field_name": "Buyer's Brokerage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "As otherwise agreed": {
                  "field_name": "As otherwise agreed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_2": {
                  "field_name": "Date_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_2": {
                  "field_name": "Year_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_3": {
                  "field_name": "Buyer Initial_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_4": {
                  "field_name": "Buyer Initial_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_3": {
                  "field_name": "Seller Initial_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_4": {
                  "field_name": "Seller Initial_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fixed": {
                  "field_name": "Fixed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Adjustable": {
                  "field_name": "Adjustable",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Conventional": {
                  "field_name": "Conventional",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "FHA": {
                  "field_name": "FHA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "VA": {
                  "field_name": "VA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "USDA": {
                  "field_name": "USDA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Other": {
                  "field_name": "Other",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Define Other": {
                  "field_name": "Define Other",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Purchase Price": {
                  "field_name": "Percent of Purchase Price",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent Per Annum": {
                  "field_name": "Percent Per Annum",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Years_1": {
                  "field_name": "Years_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Loan Amount": {
                  "field_name": "Percent of Loan Amount",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_5": {
                  "field_name": "Buyer Initial_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_6": {
                  "field_name": "Buyer Initial_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_5": {
                  "field_name": "Seller Initial_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_6": {
                  "field_name": "Seller Initial_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_7": {
                  "field_name": "Buyer Initial_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_8": {
                  "field_name": "Buyer Initial_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_7": {
                  "field_name": "Seller Initial_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_8": {
                  "field_name": "Seller Initial_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "3": {
            "fields": {
               "Buyer Initial_9": {
                  "field_name": "Buyer Initial_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_10": {
                  "field_name": "Buyer Initial_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_9": {
                  "field_name": "Seller Initial_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_10": {
                  "field_name": "Seller Initial_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_1": {
                  "field_name": "Has_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_1": {
                  "field_name": "Has Not_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_2": {
                  "field_name": "Has_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_2": {
                  "field_name": "Has Not_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_3": {
                  "field_name": "Has_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_3": {
                  "field_name": "Has Not_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_4": {
                  "field_name": "Has_4",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_4": {
                  "field_name": "Has Not_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_5": {
                  "field_name": "Has_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_5": {
                  "field_name": "Has Not_5",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Full Year Tax Bill": {
                  "field_name": "Percent of Full Year Tax Bill",
                  "field_value": "105",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "HOA Fees": {
                  "field_name": "HOA Fees",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time Frame_1": {
                  "field_name": "Time Frame_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Master/Umbrella Association Fees": {
                  "field_name": "Master/Umbrella Association Fees",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time Frame_2": {
                  "field_name": "Time Frame_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_11": {
                  "field_name": "Buyer Initial_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_12": {
                  "field_name": "Buyer Initial_12",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_11": {
                  "field_name": "Seller Initial_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_12": {
                  "field_name": "Seller Initial_12",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "4": {
            "fields": {
               "Buyer Initial_13": {
                  "field_name": "Buyer Initial_13",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_14": {
                  "field_name": "Buyer Initial_14",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_13": {
                  "field_name": "Seller Initial_13",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_14": {
                  "field_name": "Seller Initial_14",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_15": {
                  "field_name": "Buyer Initial_15",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_16": {
                  "field_name": "Buyer Initial_16",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_15": {
                  "field_name": "Seller Initial_15",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_16": {
                  "field_name": "Seller Initial_16",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "5": {
            "fields": {
               "Buyer Initial_17": {
                  "field_name": "Buyer Initial_17",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_18": {
                  "field_name": "Buyer Initial_18",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_17": {
                  "field_name": "Seller Initial_17",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_18": {
                  "field_name": "Seller Initial_18",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "6": {
            "fields": {
               "Buyer Initial_19": {
                  "field_name": "Buyer Initial_19",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_20": {
                  "field_name": "Buyer Initial_20",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_19": {
                  "field_name": "Seller Initial_19",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_20": {
                  "field_name": "Seller Initial_20",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "7": {
            "fields": {
               "Buyer Initial_21": {
                  "field_name": "Buyer Initial_21",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_22": {
                  "field_name": "Buyer Initial_22",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_21": {
                  "field_name": "Seller Initial_21",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_22": {
                  "field_name": "Seller Initial_22",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are_1": {
                  "field_name": "Are_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are Not_1": {
                  "field_name": "Are Not_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_23": {
                  "field_name": "Buyer Initial_23",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_24": {
                  "field_name": "Buyer Initial_24",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_23": {
                  "field_name": "Seller Initial_23",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_24": {
                  "field_name": "Seller Initial_24",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are_2": {
                  "field_name": "Are_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are Not_2": {
                  "field_name": "Are Not_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_25": {
                  "field_name": "Buyer Initial_25",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_26": {
                  "field_name": "Buyer Initial_26",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_25": {
                  "field_name": "Seller Initial_25",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_26": {
                  "field_name": "Seller Initial_26",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_1": {
                  "field_name": "Is_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_1": {
                  "field_name": "Is Not_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_27": {
                  "field_name": "Buyer Initial_27",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_28": {
                  "field_name": "Buyer Initial_28",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_27": {
                  "field_name": "Seller Initial_27",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_28": {
                  "field_name": "Seller Initial_28",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_2": {
                  "field_name": "Is_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_2": {
                  "field_name": "Is Not_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_29": {
                  "field_name": "Buyer Initial_29",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_30": {
                  "field_name": "Buyer Initial_30",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_29": {
                  "field_name": "Seller Initial_29",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_30": {
                  "field_name": "Seller Initial_30",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "8": {
            "fields": {
               "Buyer Initial_31": {
                  "field_name": "Buyer Initial_31",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_32": {
                  "field_name": "Buyer Initial_32",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_31": {
                  "field_name": "Seller Initial_31",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_32": {
                  "field_name": "Seller Initial_32",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "9": {
            "fields": {
               "Buyer Initials_33": {
                  "field_name": "Buyer Initials_33",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initials_34": {
                  "field_name": "Buyer Initials_34",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initials_33": {
                  "field_name": "Seller Initials_33",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initials_34": {
                  "field_name": "Seller Initials_34",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Licensee Name": {
                  "field_name": "Licensee Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_35": {
                  "field_name": "Buyer Initial_35",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_36": {
                  "field_name": "Buyer Initial_36",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_35": {
                  "field_name": "Seller Initial_35",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_36": {
                  "field_name": "Seller Initial_36",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address of Buyer's Real Estate": {
                  "field_name": "Address of Buyer's Real Estate",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_6": {
                  "field_name": "Has_6",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_6": {
                  "field_name": "Has Not_6",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_3": {
                  "field_name": "Is_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_3": {
                  "field_name": "Is Not_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_4": {
                  "field_name": "Is_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_4": {
                  "field_name": "Is Not_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_5": {
                  "field_name": "Is_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_5": {
                  "field_name": "Is Not_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_7": {
                  "field_name": "Has_7",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_7": {
                  "field_name": "Has Not_7",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Shall Publicly List": {
                  "field_name": "Shall Publicly List",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Listing Broker Name": {
                  "field_name": "Buyer's Listing Broker Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Brokers Address": {
                  "field_name": "Brokers Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Listing Broker Phone": {
                  "field_name": "Buyer's Listing Broker Phone",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Does Not Intend to List": {
                  "field_name": "Does Not Intend to List",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_37": {
                  "field_name": "Buyer Initial_37",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_38": {
                  "field_name": "Buyer Initial_38",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_37": {
                  "field_name": "Seller Initial_37",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_38": {
                  "field_name": "Seller Initial_38",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "10": {
            "fields": {
               "Date_3": {
                  "field_name": "Date_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_3": {
                  "field_name": "Year_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_4": {
                  "field_name": "Date_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_4": {
                  "field_name": "Year_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hours_1": {
                  "field_name": "Hours_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_39": {
                  "field_name": "Buyer Initial_39",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_40": {
                  "field_name": "Buyer Initial_40",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_39": {
                  "field_name": "Seller Initial_39",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_40": {
                  "field_name": "Seller Initial_40",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "11": {
            "fields": {
               "Additional Earnest Money_2": {
                  "field_name": "Additional Earnest Money_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Buyer Initial_41": {
                  "field_name": "Buyer Initial_41",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_42": {
                  "field_name": "Buyer Initial_42",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_41": {
                  "field_name": "Seller Initial_41",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_42": {
                  "field_name": "Seller Initial_42",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_5": {
                  "field_name": "Date_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_5": {
                  "field_name": "Year_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_43": {
                  "field_name": "Buyer Initial_43",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_44": {
                  "field_name": "Buyer Initial_44",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_43": {
                  "field_name": "Seller Initial_43",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_44": {
                  "field_name": "Seller Initial_44",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Home Warranty Cost": {
                  "field_name": "Home Warranty Cost",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_45": {
                  "field_name": "Buyer Initial_45",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_46": {
                  "field_name": "Buyer Initial_46",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_45": {
                  "field_name": "Seller Initial_45",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_46": {
                  "field_name": "Seller Initial_46",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_47": {
                  "field_name": "Buyer Initial_47",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_48": {
                  "field_name": "Buyer Initial_48",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_47": {
                  "field_name": "Seller Initial_47",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_48": {
                  "field_name": "Seller Initial_48",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_49": {
                  "field_name": "Buyer Initial_49",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_50": {
                  "field_name": "Buyer Initial_50",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_49": {
                  "field_name": "Seller Initial_49",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_50": {
                  "field_name": "Seller Initial_50",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_1": {
                  "field_name": "Days_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_2": {
                  "field_name": "Days_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_3": {
                  "field_name": "Days_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_6": {
                  "field_name": "Date_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_6": {
                  "field_name": "Year_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Post Closing Escrow": {
                  "field_name": "Post Closing Escrow",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Amount Per Day": {
                  "field_name": "Amount Per Day",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_51": {
                  "field_name": "Buyer Initial_51",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_52": {
                  "field_name": "Buyer Initial_52",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_51": {
                  "field_name": "Seller Initial_51",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_52": {
                  "field_name": "Seller Initial_52",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "12": {
            "fields": {
               "Buyer Initial_53": {
                  "field_name": "Buyer Initial_53",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_54": {
                  "field_name": "Buyer Initial_54",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_53": {
                  "field_name": "Seller Initial_53",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_54": {
                  "field_name": "Seller Initial_54",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_55": {
                  "field_name": "Buyer Initial_55",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_56": {
                  "field_name": "Buyer Initial_56",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_55": {
                  "field_name": "Seller Initial_55",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_56": {
                  "field_name": "Seller Initial_56",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Specified Party Name": {
                  "field_name": "Buyer's Specified Party Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_57": {
                  "field_name": "Buyer Initial_57",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_58": {
                  "field_name": "Buyer Initial_58",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_57": {
                  "field_name": "Seller Initial_57",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_58": {
                  "field_name": "Seller Initial_58",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attachments": {
                  "field_name": "Attachments",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attachments_2": {
                  "field_name": "Attachments_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_59": {
                  "field_name": "Buyer Initial_59",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_60": {
                  "field_name": "Buyer Initial_60",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_59": {
                  "field_name": "Seller Initial_59",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_60": {
                  "field_name": "Seller Initial_60",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Articles of Agreement for Deed": {
                  "field_name": "Articles of Agreement for Deed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assumption of Sellers Mortgage": {
                  "field_name": "Assumption of Sellers Mortgage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "CommercialInvestment": {
                  "field_name": "CommercialInvestment",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Cooperative Apartment": {
                  "field_name": "Cooperative Apartment",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "New Construction": {
                  "field_name": "New Construction",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Short Sale": {
                  "field_name": "Short Sale",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "TaxDeferred Exchange": {
                  "field_name": "TaxDeferred Exchange",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Vacant Land": {
                  "field_name": "Vacant Land",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MultiUnit 4 Units or fewer": {
                  "field_name": "MultiUnit 4 Units or fewer",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Interest Bearing Account": {
                  "field_name": "Interest Bearing Account",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Lease Purchase": {
                  "field_name": "Lease Purchase",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_61": {
                  "field_name": "Buyer Initial_61",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_62": {
                  "field_name": "Buyer Initial_62",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_61": {
                  "field_name": "Seller Initial_61",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_62": {
                  "field_name": "Seller Initial_62",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "13": {
            "fields": {
               "Date of Offer": {
                  "field_name": "Date of Offer",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "DATE OF ACCEPTANCE": {
                  "field_name": "DATE OF ACCEPTANCE",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Signature": {
                  "field_name": "Buyer Signature",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Signature_2": {
                  "field_name": "Buyer Signature_2",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Print Buyers Names REQUIRED": {
                  "field_name": "Print Buyers Names REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address REQUIRED": {
                  "field_name": "Address REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City State Zip REQUIRED": {
                  "field_name": "City State Zip REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_2": {
                  "field_name": "Phone_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email": {
                  "field_name": "Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Brokerage_2": {
                  "field_name": "Buyers Brokerage_2",
                  "field_value": "Baird & Warner",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MLS90": {
                  "field_name": "MLS90",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State License": {
                  "field_name": "State License",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_8": {
                  "field_name": "Address_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": '',
                  "description": ""
               },
               "City": {
                  "field_name": "City",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip": {
                  "field_name": "Zip",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Designated Agent": {
                  "field_name": "Buyers Designated Agent",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MLS_3": {
                  "field_name": "MLS_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State License_3": {
                  "field_name": "State License_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_4": {
                  "field_name": "Phone_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax": {
                  "field_name": "Fax",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_3": {
                  "field_name": "Email_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Attorney": {
                  "field_name": "Buyers Attorney",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_5": {
                  "field_name": "Email_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_10": {
                  "field_name": "Address_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "",
                  "description": ""
               },
               "City_3": {
                  "field_name": "City_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State": {
                  "field_name": "State",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_3": {
                  "field_name": "Zip_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_6": {
                  "field_name": "Phone_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_3": {
                  "field_name": "Fax_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Mortgage Company": {
                  "field_name": "Mortgage Company",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_8": {
                  "field_name": "Phone_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Loan Officer": {
                  "field_name": "Loan Officer",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "PhoneFax": {
                  "field_name": "PhoneFax",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Loan Officer Email": {
                  "field_name": "Loan Officer Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Signature": {
                  "field_name": "Seller Signature",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Signature_2": {
                  "field_name": "Seller Signature_2",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Print Sellers Names REQUIRED": {
                  "field_name": "Print Sellers Names REQUIRED",
                  "field_value": "Akram Adil, Syeda Khan",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address REQUIRED_2": {
                  "field_name": "Address REQUIRED_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City State Zip REQUIRED_2": {
                  "field_name": "City State Zip REQUIRED_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_3": {
                  "field_name": "Phone_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_2": {
                  "field_name": "Email_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Brokerage_2": {
                  "field_name": "Sellers Brokerage_2",
                  "field_value": "KOMAR",
                  "field_type": "text_field",
                  "mls_field": "ListOfficeName",
                  "is_price": false,
                  "description": ""
               },
               "MLS_2": {
                  "field_name": "MLS_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListOfficeMlsId",
                  "is_price": false,
                  "description": ""
               },
               "State License_2": {
                  "field_name": "State License_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_9": {
                  "field_name": "Address_9",
                  "field_value": "1318 E Braymore Cir",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City_2": {
                  "field_name": "City_2",
                  "field_value": "Naperville",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_2": {
                  "field_name": "Zip_2",
                  "field_value": "60564",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Designated Agent": {
                  "field_name": "Sellers Designated Agent",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListAgentFullName",
                  "is_price": false,
                  "description": ""
               },
               "MLS_4": {
                  "field_name": "MLS_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListAgentMlsId",
                  "is_price": false,
                  "description": ""
               },
               "State License_4": {
                  "field_name": "State License_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_5": {
                  "field_name": "Phone_5",
                  "field_value": "847-737-5037",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_2": {
                  "field_name": "Fax_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_4": {
                  "field_name": "Email_4",
                  "field_value": "hlibbilan@gmail.com",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Attorney": {
                  "field_name": "Sellers Attorney",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_6": {
                  "field_name": "Email_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_11": {
                  "field_name": "Address_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City_4": {
                  "field_name": "City_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State_2": {
                  "field_name": "State_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_4": {
                  "field_name": "Zip_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_7": {
                  "field_name": "Phone_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_4": {
                  "field_name": "Fax_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "HomeownersCondo Association if any": {
                  "field_name": "HomeownersCondo Association if any",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_9": {
                  "field_name": "Phone_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Management CoOther Contact": {
                  "field_name": "Management CoOther Contact",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_10": {
                  "field_name": "Phone_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Management CoOther Contact Email": {
                  "field_name": "Management CoOther Contact Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_7": {
                  "field_name": "Date_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_7": {
                  "field_name": "Year_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Hour_1": {
                  "field_name": "Time/Hour_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Minute_1": {
                  "field_name": "Time/Minute_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time": {
                  "field_name": "Time",
                  "field_value": "Off",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_8": {
                  "field_name": "Date_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_8": {
                  "field_name": "Year_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Hour_2": {
                  "field_name": "Time/Hour_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Minute_2": {
                  "field_name": "Time/Minute_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time_2": {
                  "field_name": "Time_2",
                  "field_value": "Off",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_63": {
                  "field_name": "Seller Initial_63",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_64": {
                  "field_name": "Seller Initial_64",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         }
      }
   };

   const file2 = {
      "file_name": "Multi_Board_Residential_Real_Estate_Contract_7_Fillable.pdf",
      "file_location": "input_pdf/Multi_Board_Residential_Real_Estate_Contract_7_Fillable.pdf",
      "pages": {
         "1": {
            "fields": {
               "Buyer Name_001": {
                  "field_name": "Buyer Name_001",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": "Name of the buyer"
               },
               "Seller Name_001": {
                  "field_name": "Seller Name_001",
                  "field_value": "Puthanmadhom Narayan, Valavil Binolya",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,

                  "description": ""
               },
               "Dual Agency Check": {
                  "field_name": "Dual Agency Check",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Approx. Lot Size or Acreage": {
                  "field_name": "Approx. Lot Size or Acreage",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "UnparsedAddress",
                  "is_price": false,
                  "description": ""
               },
               "Permanent Index Numbers": {
                  "field_name": "Permanent Index Numbers",
                  "field_value": "0701221010900000",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Single Family Attached": {
                  "field_name": "Single Family Attached",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Single Family Detached": {
                  "field_name": "Single Family Detached",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MultiUnit": {
                  "field_name": "MultiUnit",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Number of Parking Spaces": {
                  "field_name": "Number of Parking Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Identified as Spaces": {
                  "field_name": "Identified as Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Location": {
                  "field_name": "Location",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space": {
                  "field_name": "Deeded Space",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space PIN": {
                  "field_name": "Deeded Space PIN",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Limited Common Element": {
                  "field_name": "Limited Common Element",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assigned Space": {
                  "field_name": "Assigned Space",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Number of Designated Storage Spaces": {
                  "field_name": "Number of Designated Storage Spaces",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Identified as Spaces_2": {
                  "field_name": "Identified as Spaces_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Location_2": {
                  "field_name": "Location_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space_2": {
                  "field_name": "Deeded Space_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Deeded Space PIN_2": {
                  "field_name": "Deeded Space PIN_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Limited Common Element_2": {
                  "field_name": "Limited Common Element_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assigned Space_2": {
                  "field_name": "Assigned Space_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Refrigerator_1": {
                  "field_name": "Refrigerator_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": null,
                  "description": ""
               },
               "Refrigerator_2": {
                  "field_name": "Refrigerator_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wine/Beverage Refrigerator_1": {
                  "field_name": "Wine/Beverage Refrigerator_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wine/Beverage Refrigerator_2": {
                  "field_name": "Wine/Beverage Refrigerator_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Light Fixtures_1": {
                  "field_name": "Light Fixtures_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Light Fixtures_2": {
                  "field_name": "Light Fixtures_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fireplace Gas Log(s)_1": {
                  "field_name": "Fireplace Gas Log(s)_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "FireplaceFeatures",
                  "is_price": false,
                  "mls_value": "Gas Log",
                  "description": ""
               },
               "Fireplace Gas Log(s)_2": {
                  "field_name": "Fireplace Gas Log(s)_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Oven/Range/Stove_1": {
                  "field_name": "Oven/Range/Stove_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Range",
                  "description": ""
               },
               "Oven/Range/Stove_2": {
                  "field_name": "Oven/Range/Stove_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sump Pump_1": {
                  "field_name": "Sump Pump_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sump Pump_2": {
                  "field_name": "Sump Pump_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Built-in/attached shelving_1": {
                  "field_name": "Built-in/attached shelving_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Built-in/attached shelving_2": {
                  "field_name": "Built-in/attached shelving_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Smoke Detectors_1": {
                  "field_name": "Smoke Detectors_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Smoke Detectors_2": {
                  "field_name": "Smoke Detectors_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Microwave_1": {
                  "field_name": "Microwave_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Microwave",
                  "description": ""
               },
               "Microwave_2": {
                  "field_name": "Microwave_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Softener_1": {
                  "field_name": "Water Softener_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Softener_2": {
                  "field_name": "Water Softener_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Treatments_1": {
                  "field_name": "Window Treatments_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Treatments_2": {
                  "field_name": "Window Treatments_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Carbon Monoxide_1": {
                  "field_name": "Carbon Monoxide_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Carbon Monoxide_2": {
                  "field_name": "Carbon Monoxide_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Dishwasher_1": {
                  "field_name": "Dishwasher_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Dishwasher",
                  "description": ""
               },
               "Dishwasher_2": {
                  "field_name": "Dishwasher_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Air Conditioning_1": {
                  "field_name": "Central Air Conditioning_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Air Conditioning_2": {
                  "field_name": "Central Air Conditioning_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Satellite Dish_1": {
                  "field_name": "Satellite Dish_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Satellite Dish_2": {
                  "field_name": "Satellite Dish_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Invisible Fence System_1": {
                  "field_name": "Invisible Fence System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Invisible Fence System_2": {
                  "field_name": "Invisible Fence System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garbage Disposal_1": {
                  "field_name": "Garbage Disposal_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Disposal",
                  "description": ""
               },
               "Garbage Disposal_2": {
                  "field_name": "Garbage Disposal_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Humidifier_1": {
                  "field_name": "Central Humidifier_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Humidifier_2": {
                  "field_name": "Central Humidifier_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wall Mounted Brackets_1": {
                  "field_name": "Wall Mounted Brackets_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Wall Mounted Brackets_2": {
                  "field_name": "Wall Mounted Brackets_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garage Door Opener_1": {
                  "field_name": "Garage Door Opener_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Garage Door Opener_2": {
                  "field_name": "Garage Door Opener_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Trash Compactor_1": {
                  "field_name": "Trash Compactor_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Trash Compactor_2": {
                  "field_name": "Trash Compactor_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Vac & Equipment_1": {
                  "field_name": "Central Vac & Equipment_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Central Vac & Equipment_2": {
                  "field_name": "Central Vac & Equipment_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Security System_1": {
                  "field_name": "Security System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Security System_2": {
                  "field_name": "Security System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Washer_1": {
                  "field_name": "Washer_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Washer_2": {
                  "field_name": "Washer_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Tacked Down Carpeting_1": {
                  "field_name": "Tacked Down Carpeting_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Tacked Down Carpeting_2": {
                  "field_name": "Tacked Down Carpeting_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Intercom System_1": {
                  "field_name": "Intercom System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Intercom System_2": {
                  "field_name": "Intercom System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Shed_1": {
                  "field_name": "Outdoor Shed_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Shed_2": {
                  "field_name": "Outdoor Shed_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Dryer_1": {
                  "field_name": "Dryer_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "Appliances",
                  "is_price": false,
                  "mls_value": "Dryer",
                  "description": ""
               },
               "Dryer_2": {
                  "field_name": "Dryer_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Existing Storms & Screens_1": {
                  "field_name": "Existing Storms & Screens_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Existing Storms & Screens_2": {
                  "field_name": "Existing Storms & Screens_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Electronic or Media Air Filter_1": {
                  "field_name": "Electronic or Media Air Filter_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Electronic or Media Air Filter_2": {
                  "field_name": "Electronic or Media Air Filter_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Playset_1": {
                  "field_name": "Outdoor Playset_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Outdoor Playset_2": {
                  "field_name": "Outdoor Playset_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attached Gas Grill_1": {
                  "field_name": "Attached Gas Grill_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attached Gas Grill_2": {
                  "field_name": "Attached Gas Grill_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Air Conditioner_1": {
                  "field_name": "Window Air Conditioner_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Window Air Conditioner_2": {
                  "field_name": "Window Air Conditioner_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Backup Generator System_1": {
                  "field_name": "Backup Generator System_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Backup Generator System_2": {
                  "field_name": "Backup Generator System_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Planted Vegetation_1": {
                  "field_name": "Planted Vegetation_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Planted Vegetation_2": {
                  "field_name": "Planted Vegetation_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Heater_1": {
                  "field_name": "Water Heater_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Water Heater_2": {
                  "field_name": "Water Heater_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Ceiling Fan_1": {
                  "field_name": "Ceiling Fan_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "OtherEquipment",
                  "is_price": false,
                  "mls_value": "Ceiling Fan(s)",
                  "description": ""
               },
               "Ceiling Fan_2": {
                  "field_name": "Ceiling Fan_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fireplace Screens/Doors/Grates_1": {
                  "field_name": "Fireplace Screens/Doors/Grates_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": "FireplaceFeatures",
                  "is_price": false,
                  "mls_value": "Attached Fireplace Doors/Screen",
                  "description": ""
               },
               "Fireplace Screens/Doors/Grates_2": {
                  "field_name": "Fireplace Screens/Doors/Grates_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hardscape_1": {
                  "field_name": "Hardscape_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hardscape_2": {
                  "field_name": "Hardscape_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Other Items Included at No Added Value": {
                  "field_name": "Other Items Included at No Added Value",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Items Not Included": {
                  "field_name": "Items Not Included",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Items Not in Operating Condition": {
                  "field_name": "Items Not in Operating Condition",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Home Warranty Applies": {
                  "field_name": "Home Warranty Applies",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Purchase Price": {
                  "field_name": "Purchase Price",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Credit Amount": {
                  "field_name": "Credit Amount",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Earnest Money": {
                  "field_name": "Earnest Money",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Business Days_1": {
                  "field_name": "Business Days_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Additional Earnest Money": {
                  "field_name": "Additional Earnest Money",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Date_1": {
                  "field_name": "Date_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_1": {
                  "field_name": "Year_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_1": {
                  "field_name": "Buyer Initial_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_2": {
                  "field_name": "Buyer Initial_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_1": {
                  "field_name": "Seller Initial_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_2": {
                  "field_name": "Seller Initial_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "2": {
            "fields": {
               "Seller's Brokerage": {
                  "field_name": "Seller's Brokerage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Brokerage": {
                  "field_name": "Buyer's Brokerage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "As otherwise agreed": {
                  "field_name": "As otherwise agreed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_2": {
                  "field_name": "Date_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_2": {
                  "field_name": "Year_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_3": {
                  "field_name": "Buyer Initial_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_4": {
                  "field_name": "Buyer Initial_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_3": {
                  "field_name": "Seller Initial_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_4": {
                  "field_name": "Seller Initial_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fixed": {
                  "field_name": "Fixed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Adjustable": {
                  "field_name": "Adjustable",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Conventional": {
                  "field_name": "Conventional",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "FHA": {
                  "field_name": "FHA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "VA": {
                  "field_name": "VA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "USDA": {
                  "field_name": "USDA",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Other": {
                  "field_name": "Other",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Define Other": {
                  "field_name": "Define Other",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Purchase Price": {
                  "field_name": "Percent of Purchase Price",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent Per Annum": {
                  "field_name": "Percent Per Annum",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Years_1": {
                  "field_name": "Years_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Loan Amount": {
                  "field_name": "Percent of Loan Amount",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_5": {
                  "field_name": "Buyer Initial_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_6": {
                  "field_name": "Buyer Initial_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_5": {
                  "field_name": "Seller Initial_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_6": {
                  "field_name": "Seller Initial_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_7": {
                  "field_name": "Buyer Initial_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_8": {
                  "field_name": "Buyer Initial_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_7": {
                  "field_name": "Seller Initial_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_8": {
                  "field_name": "Seller Initial_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "3": {
            "fields": {
               "Buyer Initial_9": {
                  "field_name": "Buyer Initial_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_10": {
                  "field_name": "Buyer Initial_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_9": {
                  "field_name": "Seller Initial_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_10": {
                  "field_name": "Seller Initial_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_1": {
                  "field_name": "Has_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_1": {
                  "field_name": "Has Not_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_2": {
                  "field_name": "Has_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_2": {
                  "field_name": "Has Not_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_3": {
                  "field_name": "Has_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_3": {
                  "field_name": "Has Not_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_4": {
                  "field_name": "Has_4",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_4": {
                  "field_name": "Has Not_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_5": {
                  "field_name": "Has_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_5": {
                  "field_name": "Has Not_5",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Percent of Full Year Tax Bill": {
                  "field_name": "Percent of Full Year Tax Bill",
                  "field_value": "105",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "HOA Fees": {
                  "field_name": "HOA Fees",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time Frame_1": {
                  "field_name": "Time Frame_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Master/Umbrella Association Fees": {
                  "field_name": "Master/Umbrella Association Fees",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time Frame_2": {
                  "field_name": "Time Frame_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_11": {
                  "field_name": "Buyer Initial_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_12": {
                  "field_name": "Buyer Initial_12",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_11": {
                  "field_name": "Seller Initial_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_12": {
                  "field_name": "Seller Initial_12",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "4": {
            "fields": {
               "Buyer Initial_13": {
                  "field_name": "Buyer Initial_13",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_14": {
                  "field_name": "Buyer Initial_14",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_13": {
                  "field_name": "Seller Initial_13",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_14": {
                  "field_name": "Seller Initial_14",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_15": {
                  "field_name": "Buyer Initial_15",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_16": {
                  "field_name": "Buyer Initial_16",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_15": {
                  "field_name": "Seller Initial_15",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_16": {
                  "field_name": "Seller Initial_16",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "5": {
            "fields": {
               "Buyer Initial_17": {
                  "field_name": "Buyer Initial_17",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_18": {
                  "field_name": "Buyer Initial_18",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_17": {
                  "field_name": "Seller Initial_17",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_18": {
                  "field_name": "Seller Initial_18",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "6": {
            "fields": {
               "Buyer Initial_19": {
                  "field_name": "Buyer Initial_19",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_20": {
                  "field_name": "Buyer Initial_20",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_19": {
                  "field_name": "Seller Initial_19",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_20": {
                  "field_name": "Seller Initial_20",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "7": {
            "fields": {
               "Buyer Initial_21": {
                  "field_name": "Buyer Initial_21",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_22": {
                  "field_name": "Buyer Initial_22",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_21": {
                  "field_name": "Seller Initial_21",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_22": {
                  "field_name": "Seller Initial_22",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are_1": {
                  "field_name": "Are_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are Not_1": {
                  "field_name": "Are Not_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_23": {
                  "field_name": "Buyer Initial_23",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_24": {
                  "field_name": "Buyer Initial_24",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_23": {
                  "field_name": "Seller Initial_23",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_24": {
                  "field_name": "Seller Initial_24",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are_2": {
                  "field_name": "Are_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Are Not_2": {
                  "field_name": "Are Not_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_25": {
                  "field_name": "Buyer Initial_25",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_26": {
                  "field_name": "Buyer Initial_26",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_25": {
                  "field_name": "Seller Initial_25",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_26": {
                  "field_name": "Seller Initial_26",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_1": {
                  "field_name": "Is_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_1": {
                  "field_name": "Is Not_1",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_27": {
                  "field_name": "Buyer Initial_27",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_28": {
                  "field_name": "Buyer Initial_28",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_27": {
                  "field_name": "Seller Initial_27",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_28": {
                  "field_name": "Seller Initial_28",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_2": {
                  "field_name": "Is_2",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_2": {
                  "field_name": "Is Not_2",
                  "field_value": true,
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_29": {
                  "field_name": "Buyer Initial_29",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_30": {
                  "field_name": "Buyer Initial_30",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_29": {
                  "field_name": "Seller Initial_29",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_30": {
                  "field_name": "Seller Initial_30",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "8": {
            "fields": {
               "Buyer Initial_31": {
                  "field_name": "Buyer Initial_31",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_32": {
                  "field_name": "Buyer Initial_32",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_31": {
                  "field_name": "Seller Initial_31",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_32": {
                  "field_name": "Seller Initial_32",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "9": {
            "fields": {
               "Buyer Initials_33": {
                  "field_name": "Buyer Initials_33",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initials_34": {
                  "field_name": "Buyer Initials_34",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initials_33": {
                  "field_name": "Seller Initials_33",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initials_34": {
                  "field_name": "Seller Initials_34",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Licensee Name": {
                  "field_name": "Licensee Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_35": {
                  "field_name": "Buyer Initial_35",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_36": {
                  "field_name": "Buyer Initial_36",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_35": {
                  "field_name": "Seller Initial_35",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_36": {
                  "field_name": "Seller Initial_36",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address of Buyer's Real Estate": {
                  "field_name": "Address of Buyer's Real Estate",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_6": {
                  "field_name": "Has_6",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_6": {
                  "field_name": "Has Not_6",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_3": {
                  "field_name": "Is_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_3": {
                  "field_name": "Is Not_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_4": {
                  "field_name": "Is_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_4": {
                  "field_name": "Is Not_4",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is_5": {
                  "field_name": "Is_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Is Not_5": {
                  "field_name": "Is Not_5",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has_7": {
                  "field_name": "Has_7",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Has Not_7": {
                  "field_name": "Has Not_7",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Shall Publicly List": {
                  "field_name": "Shall Publicly List",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Listing Broker Name": {
                  "field_name": "Buyer's Listing Broker Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Brokers Address": {
                  "field_name": "Brokers Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Listing Broker Phone": {
                  "field_name": "Buyer's Listing Broker Phone",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Does Not Intend to List": {
                  "field_name": "Does Not Intend to List",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_37": {
                  "field_name": "Buyer Initial_37",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_38": {
                  "field_name": "Buyer Initial_38",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_37": {
                  "field_name": "Seller Initial_37",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_38": {
                  "field_name": "Seller Initial_38",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "10": {
            "fields": {
               "Date_3": {
                  "field_name": "Date_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_3": {
                  "field_name": "Year_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_4": {
                  "field_name": "Date_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_4": {
                  "field_name": "Year_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Hours_1": {
                  "field_name": "Hours_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_39": {
                  "field_name": "Buyer Initial_39",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_40": {
                  "field_name": "Buyer Initial_40",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_39": {
                  "field_name": "Seller Initial_39",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_40": {
                  "field_name": "Seller Initial_40",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "11": {
            "fields": {
               "Additional Earnest Money_2": {
                  "field_name": "Additional Earnest Money_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": true,
                  "description": ""
               },
               "Buyer Initial_41": {
                  "field_name": "Buyer Initial_41",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_42": {
                  "field_name": "Buyer Initial_42",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_41": {
                  "field_name": "Seller Initial_41",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_42": {
                  "field_name": "Seller Initial_42",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_5": {
                  "field_name": "Date_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_5": {
                  "field_name": "Year_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_43": {
                  "field_name": "Buyer Initial_43",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_44": {
                  "field_name": "Buyer Initial_44",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_43": {
                  "field_name": "Seller Initial_43",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_44": {
                  "field_name": "Seller Initial_44",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Home Warranty Cost": {
                  "field_name": "Home Warranty Cost",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_45": {
                  "field_name": "Buyer Initial_45",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_46": {
                  "field_name": "Buyer Initial_46",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_45": {
                  "field_name": "Seller Initial_45",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_46": {
                  "field_name": "Seller Initial_46",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_47": {
                  "field_name": "Buyer Initial_47",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_48": {
                  "field_name": "Buyer Initial_48",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_47": {
                  "field_name": "Seller Initial_47",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_48": {
                  "field_name": "Seller Initial_48",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_49": {
                  "field_name": "Buyer Initial_49",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_50": {
                  "field_name": "Buyer Initial_50",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_49": {
                  "field_name": "Seller Initial_49",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_50": {
                  "field_name": "Seller Initial_50",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_1": {
                  "field_name": "Days_1",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_2": {
                  "field_name": "Days_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Days_3": {
                  "field_name": "Days_3",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_6": {
                  "field_name": "Date_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_6": {
                  "field_name": "Year_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Post Closing Escrow": {
                  "field_name": "Post Closing Escrow",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Amount Per Day": {
                  "field_name": "Amount Per Day",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_51": {
                  "field_name": "Buyer Initial_51",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_52": {
                  "field_name": "Buyer Initial_52",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_51": {
                  "field_name": "Seller Initial_51",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_52": {
                  "field_name": "Seller Initial_52",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "12": {
            "fields": {
               "Buyer Initial_53": {
                  "field_name": "Buyer Initial_53",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_54": {
                  "field_name": "Buyer Initial_54",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_53": {
                  "field_name": "Seller Initial_53",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_54": {
                  "field_name": "Seller Initial_54",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_55": {
                  "field_name": "Buyer Initial_55",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_56": {
                  "field_name": "Buyer Initial_56",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_55": {
                  "field_name": "Seller Initial_55",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_56": {
                  "field_name": "Seller Initial_56",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer's Specified Party Name": {
                  "field_name": "Buyer's Specified Party Name",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_57": {
                  "field_name": "Buyer Initial_57",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_58": {
                  "field_name": "Buyer Initial_58",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_57": {
                  "field_name": "Seller Initial_57",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_58": {
                  "field_name": "Seller Initial_58",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attachments": {
                  "field_name": "Attachments",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Attachments_2": {
                  "field_name": "Attachments_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_59": {
                  "field_name": "Buyer Initial_59",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_60": {
                  "field_name": "Buyer Initial_60",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_59": {
                  "field_name": "Seller Initial_59",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_60": {
                  "field_name": "Seller Initial_60",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Articles of Agreement for Deed": {
                  "field_name": "Articles of Agreement for Deed",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Assumption of Sellers Mortgage": {
                  "field_name": "Assumption of Sellers Mortgage",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "CommercialInvestment": {
                  "field_name": "CommercialInvestment",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Cooperative Apartment": {
                  "field_name": "Cooperative Apartment",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "New Construction": {
                  "field_name": "New Construction",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Short Sale": {
                  "field_name": "Short Sale",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "TaxDeferred Exchange": {
                  "field_name": "TaxDeferred Exchange",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Vacant Land": {
                  "field_name": "Vacant Land",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MultiUnit 4 Units or fewer": {
                  "field_name": "MultiUnit 4 Units or fewer",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Interest Bearing Account": {
                  "field_name": "Interest Bearing Account",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Lease Purchase": {
                  "field_name": "Lease Purchase",
                  "field_value": "",
                  "field_type": "checkbox",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_61": {
                  "field_name": "Buyer Initial_61",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Initial_62": {
                  "field_name": "Buyer Initial_62",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_61": {
                  "field_name": "Seller Initial_61",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_62": {
                  "field_name": "Seller Initial_62",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         },
         "13": {
            "fields": {
               "Date of Offer": {
                  "field_name": "Date of Offer",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "DATE OF ACCEPTANCE": {
                  "field_name": "DATE OF ACCEPTANCE",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Signature": {
                  "field_name": "Buyer Signature",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyer Signature_2": {
                  "field_name": "Buyer Signature_2",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Print Buyers Names REQUIRED": {
                  "field_name": "Print Buyers Names REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address REQUIRED": {
                  "field_name": "Address REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City State Zip REQUIRED": {
                  "field_name": "City State Zip REQUIRED",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_2": {
                  "field_name": "Phone_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email": {
                  "field_name": "Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Brokerage_2": {
                  "field_name": "Buyers Brokerage_2",
                  "field_value": "Baird & Warner",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MLS90": {
                  "field_name": "MLS90",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State License": {
                  "field_name": "State License",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_8": {
                  "field_name": "Address_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "description": ""
               },
               "City": {
                  "field_name": "City",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip": {
                  "field_name": "Zip",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Designated Agent": {
                  "field_name": "Buyers Designated Agent",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "MLS_3": {
                  "field_name": "MLS_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State License_3": {
                  "field_name": "State License_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_4": {
                  "field_name": "Phone_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax": {
                  "field_name": "Fax",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_3": {
                  "field_name": "Email_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Buyers Attorney": {
                  "field_name": "Buyers Attorney",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_5": {
                  "field_name": "Email_5",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_10": {
                  "field_name": "Address_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "",
                  "description": ""
               },
               "City_3": {
                  "field_name": "City_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State": {
                  "field_name": "State",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_3": {
                  "field_name": "Zip_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_6": {
                  "field_name": "Phone_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_3": {
                  "field_name": "Fax_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Mortgage Company": {
                  "field_name": "Mortgage Company",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_8": {
                  "field_name": "Phone_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Loan Officer": {
                  "field_name": "Loan Officer",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "PhoneFax": {
                  "field_name": "PhoneFax",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Loan Officer Email": {
                  "field_name": "Loan Officer Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Signature": {
                  "field_name": "Seller Signature",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Signature_2": {
                  "field_name": "Seller Signature_2",
                  "field_value": "",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Print Sellers Names REQUIRED": {
                  "field_name": "Print Sellers Names REQUIRED",
                  "field_value": "Puthanmadhom Narayan, Valavil Binolya",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address REQUIRED_2": {
                  "field_name": "Address REQUIRED_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City State Zip REQUIRED_2": {
                  "field_name": "City State Zip REQUIRED_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_3": {
                  "field_name": "Phone_3",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_2": {
                  "field_name": "Email_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Brokerage_2": {
                  "field_name": "Sellers Brokerage_2",
                  "field_value": "3812 Tall Grass Drive",
                  "field_type": "text_field",
                  "mls_field": "ListOfficeName",
                  "is_price": false,
                  "description": ""
               },
               "MLS_2": {
                  "field_name": "MLS_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListOfficeMlsId",
                  "is_price": false,
                  "description": ""
               },
               "State License_2": {
                  "field_name": "State License_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_9":{
                  "field_name": "Address_9",
                  "field_value": "3812 Tall Grass Drive",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City_2": {
                  "field_name": "City_2",
                  "field_value": "Naperville",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_2": {
                  "field_name": "Zip_2",
                  "field_value": "60564",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Designated Agent": {
                  "field_name": "Sellers Designated Agent",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListAgentFullName",
                  "is_price": false,
                  "description": ""
               },
               "MLS_4": {
                  "field_name": "MLS_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": "ListAgentMlsId",
                  "is_price": false,
                  "description": ""
               },
               "State License_4": {
                  "field_name": "State License_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_5": {
                  "field_name": "Phone_5",
                  "field_value": "630-922-7678",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_2": {
                  "field_name": "Fax_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_4": {
                  "field_name": "Email_4",
                  "field_value": "sri@raavstar.com",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Sellers Attorney": {
                  "field_name": "Sellers Attorney",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Email_6": {
                  "field_name": "Email_6",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address_11": {
                  "field_name": "Address_11",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "City_4": {
                  "field_name": "City_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "State_2": {
                  "field_name": "State_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Zip_4": {
                  "field_name": "Zip_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_7": {
                  "field_name": "Phone_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Fax_4": {
                  "field_name": "Fax_4",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "HomeownersCondo Association if any": {
                  "field_name": "HomeownersCondo Association if any",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_9": {
                  "field_name": "Phone_9",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Management CoOther Contact": {
                  "field_name": "Management CoOther Contact",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Phone_10": {
                  "field_name": "Phone_10",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Management CoOther Contact Email": {
                  "field_name": "Management CoOther Contact Email",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_7": {
                  "field_name": "Date_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_7": {
                  "field_name": "Year_7",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Hour_1": {
                  "field_name": "Time/Hour_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Minute_1": {
                  "field_name": "Time/Minute_1",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time": {
                  "field_name": "Time",
                  "field_value": "Off",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Date_8": {
                  "field_name": "Date_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Year_8": {
                  "field_name": "Year_8",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Hour_2": {
                  "field_name": "Time/Hour_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time/Minute_2": {
                  "field_name": "Time/Minute_2",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Time_2": {
                  "field_name": "Time_2",
                  "field_value": "Off",
                  "field_type": "",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_63": {
                  "field_name": "Seller Initial_63",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Seller Initial_64": {
                  "field_name": "Seller Initial_64",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               },
               "Address": {
                  "field_name": "Address",
                  "field_value": "",
                  "field_type": "text_field",
                  "mls_field": null,
                  "is_price": false,
                  "description": ""
               }
            }
         }
      }
   }

   // if file conditions 
   const mlsId = mini_dict?.["MLS"];

   console.log('mlsID', mlsId)

   const skeleton = {
      'session_id': '', 'property_details': { 'listing_id': 11974732, 'listing_key': '', 'property_name': '' }, 'files': [mlsId === 12261089 ? file2 : file1]
   };
   var final = skeleton;
   console.log("----------------------------------")
   for (var i = 0; i < Object.keys(final["files"][0]["pages"]).length; i++) {
      var page = Object.keys(final["files"][0]["pages"])[String(i)];
      for (var j = 0; j < Object.keys(final["files"][0]["pages"][page]["fields"]).length; j++) {
         var field = Object.keys(final["files"][0]["pages"][page]["fields"])[j];
         if (mini_dict[field] != null) {
            console.log(final["files"][0]["pages"][page]["fields"][field]["field_name"])
            console.log(final["files"][0]["pages"][page]["fields"][field]["field_value"])
            if (final["files"][0]["pages"][page]["fields"][field]["field_type"] == "text_field")
               final["files"][0]["pages"][page]["fields"][field]["field_value"] = String(mini_dict[field]);
            else
               final["files"][0]["pages"][page]["fields"][field]["field_value"] = mini_dict[field];
         }
      }
   }
   final["property_details"]["listing_id"] = mini_dict["MLS"];

   return final;
}


async function chat(messages) {
   try {
      // Initialize local dictionary
      const localMiniDict = { ...messages.mini_dict || {} };

      // Initialize Google Gemini Client

      const keys = ['AIzaSyDFPb--kLUyaBeGZGo0pdYPUyX2Bawvz3g', 'AIzaSyCxfTXDsMg5CRp85TouZdZSKsLq1tr9wI8','AIzaSyDBDAmuAudfW90ez6oeDkdAc_h0X-8Ayek'];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];

      const client = new GoogleGenerativeAI(randomKey);
      // const client = new GoogleGenerativeAI('AIzaSyDFPb--kLUyaBeGZGo0pdYPUyX2Bawvz3g');
      const systemMessages = [{ role: "system", content: sysmsg }].concat(fewshot);
      const localConversation = systemMessages.concat(messages.conversation);

      // Configure Model
      const model = client.getGenerativeModel({
         model: "gemini-2.0-flash-exp",
         temperature: 1,
         systemInstruction: systemMessages
      });

      // Generate content from Gemini model
      const result = await model.generateContent(JSON.stringify(localConversation));

      if (!result?.response) {
         throw new Error("Invalid response from AI model");
      }

      // Extract and clean AI response
      const output = result.response.text()
         ?.replace(/```json/g, "")
         ?.replace(/```/g, "");

      logger.info(`Gemini output ${output}`);

      let parsedContent;
      try {
         parsedContent = JSON.parse(output);
      } catch (err) {
         throw new Error("Failed to parse AI response: " + err.message);
      }

      // Update mini dictionary if new values exist
      const updMiniDict = parsedContent["field_value"];


      if (updMiniDict !== "none") {
         Object.assign(localMiniDict, updMiniDict);
      }


      // Construct updated conversation
      const updatedConversation = [...messages.conversation, { content: output, role: 'assistant' }];

      // Build response object
      const resp = {
         "resp_obj": {
            "status": "ongoing",
            "conversation": updatedConversation,
            "resp_dict": null,
            "mini_dict": localMiniDict
         }
      };

      if (parsedContent["response"] === "none") {
         // Conversation completed - Generate final response
         resp["resp_obj"]["status"] = "completed";
         const finalConfig = feedValues(localMiniDict);
         resp["resp_obj"]["resp_dict"] = finalConfig;
         localMiniDict["Print Buyers Names REQUIRED"] = localMiniDict["Buyer Name_001"];
         localMiniDict["Email"] = localMiniDict["buyer_email"];
         // Prepare PDF data
         const pdfData = {
            "pdf_fields": finalConfig,
            "mini_dict": localMiniDict,
            "envelope_args": {
               "signer_email": localMiniDict["buyer_email"],
               "signer_name": localMiniDict["Buyer Name_001"],
               "cc_email": "waeez@deepnetlabs.com",  // rdibiase@maxhome.ai
               "cc_name": "waeez", // rob
               "signer_email2": "",
               "signer_name2": "",
               "signer_email3": "",
               "signer_name3": ""
            }
         };

         // Call PDF filler service
         const pdfRes = await callPDFFiller(pdfData);
         if (pdfRes?.url) {
            resp["resp_obj"]["url"] = pdfRes.url;
         }
         resp["resp_obj"]["envelope_args"] = pdfData["envelope_args"];
      }

      return resp;

   } catch (error) {
      console.error("Error in chat function:", error.message);
      return {
         "resp_obj": {
            "status": "error",
            "error_message": error.message
         }
      };
   }
}


async function callPDFFiller(pdfData) {
   // Call the serverless function to generate the PDF
   //  console.log("pdfData", pdfData)

   const response = await axios.post('https://us-central1-maxhome-410814.cloudfunctions.net/DeepnetTest', pdfData);
   console.log("response", response)
   const response_data = JSON.parse(response.data.body);
   console.log("response_data", response_data)
   return {
      message: 'Buyer agency created successfully',
      url: response_data.url,
   }
}


async function synthesizeSpeech(text) {
   try {
      // Creates a client
      const client = new textToSpeech.TextToSpeechClient();

      // Function to convert numbers based on context
      function convertNumbers(text) {
         return text.replace(/\b(\d+)\b/g, (match, number, offset, fullText) => {
            const prefix = fullText.substring(Math.max(0, offset - 10), offset).trim().toLowerCase();
            if (/(mls id|tracking number|serial number)/.test(prefix)) {
               return `<say-as interpret-as="characters">${number}</say-as>`;
            }
            return number; // Read normally for other numbers (e.g., currency)
         });
      }

      // Convert numbers dynamically
      const supportsSSML = true; // Assume SSML support for this example
      const inputText = supportsSSML ? { ssml: `<speak>${convertNumbers(text)}</speak>` } : { text: text };

      // Configure input
      const request = {
         input: inputText,
         voice: {
            languageCode: 'en-US',
            name: 'en-US-Standard-C',
         },
         audioConfig: {
            audioEncoding: 'MP3',
         },
      };

      // Perform the Text-to-Speech request
      const [response] = await client.synthesizeSpeech(request);

      // Base64-encode the audio content
      return response.audioContent.toString('base64');
   } catch (error) {
      console.error('Error during text-to-speech synthesis:', error.message);
      return `Error during text-to-speech synthesis: ${error.message}`;
   }
}


async function contentExt(respObj) {
   try {
      // Extract conversation array
      const conversation = respObj.resp_obj.conversation;

      let latestAssistantResponse = null;

      // Iterate in reverse to find the latest assistant response
      for (let i = conversation.length - 1; i >= 0; i--) {
         const message = conversation[i];
         if (message.role === 'assistant') {
            try {
               const content = JSON.parse(message.content); // Parse the JSON string
               console.log('content assistant', content)
               latestAssistantResponse = content.response;
               console.log('last assistant response', latestAssistantResponse)
               if (!latestAssistantResponse) {
                  throw new Error('Response field is missing or empty in the content.');
               }
               break;
            } catch (error) {
               console.error('JSON parsing error:', error.message);
               return `Error: Failed to parse content JSON: ${error.message}`;
            }
         }
      }

      if (!latestAssistantResponse) {
         throw new Error('No assistant response found in the conversation.');
      }

      if (latestAssistantResponse !== 'none') {
         return await synthesizeSpeech(latestAssistantResponse);
      } else {
         hardedCodedMessage = "Yay! Your offer is ready. We'll send this to you on your email as well."
         return await synthesizeSpeech(hardedCodedMessage)
      }
      // Synthesize speech from the latest assistant response
   } catch (error) {
      console.error('Error:####', error.message);
      return `Error: ${error.message}`;
   }
}


module.exports = { chat, contentExt }