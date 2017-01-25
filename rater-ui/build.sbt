name := """rater-ui"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  "com.typesafe.play" %% "anorm" % "2.5.2",
  "mysql" % "mysql-connector-java" % "5.1.36",
  "com.typesafe.play" %% "play-mailer" % "5.0.0"
)
