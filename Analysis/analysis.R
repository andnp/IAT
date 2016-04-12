# Load necessary packages
if("plyr" %in% rownames(installed.packages()) == FALSE){
  install.packages("plyr") 
}
if("psych" %in% rownames(installed.packages()) == FALSE){
  install.packages("psych")
}
library(plyr)
library(psych)


if(!exists("dat")){
  dat = read.csv(file=file.choose(), header=TRUE)
  column_names <- c("ID", "Token", "SubmitDate", "Language", "Start", "Finish", "IP", "RefUrl", "Agree", "unknown1", "unknown2", "Gender", "Grade", "Major", "Age", "SelfIntroversion", "Talkative", "Reserved", "Energetic", "Enthusiastic", "Quiet", "Assertive", "Shy", "Sociable", "Preference", "Intel", "Academic", "FeelIntro", "FeelExtro", "MeanResp", "MeanDif", "SD", "D") 
  colnames(dat) = column_names
  dat = as.data.frame(dat)
}

# Takes a dataFrame and a list of column names
# Returns a dataFrame without the columns listed
removeColumns = function(df, columns){
  return(df[, !(names(df) %in% columns)])
}

# Takes a dataFrame and recodes Gender
# Males are recoded to 1, Females to 2
# Currently Other is not recoded as no data was recorded for Other
# Returns dataFrame with all columns (gender recoded)
recodeGender = function(df){
  df$Gender = revalue(df$Gender, c("M" = 1, "F" = 2))
  df$Gender = as.numeric(levels(df$Gender))[df$Gender]
  return (df)
}

# Usage: data <- removeIncompleteRows(data)
removeIncompleteRows = function(dataFrame){
  rows <- complete.cases(dataFrame)
  return(dataFrame[rows,])
}

# Takes a dataFrame and returns correlation Matrix dataframe
getCorrelationMatrix = function(df){
  return( cor(df) )
}

# Script
df = removeColumns(dat, c("ID", "Token", "SubmitDate", "Language", "Start", "Finish", "IP", "RefUrl", "Agree", "unknown1", "unknown2", "Major", "MeanResp", "MeanDif", "SD", "Grade", "Age"))
df = removeIncompleteRows(df)
df = recodeGender(df)
correlationMatrix = getCorrelationMatrix(df)
stats = corr.test(df)