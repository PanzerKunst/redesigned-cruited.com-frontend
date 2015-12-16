name := """website"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.6"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  specs2 % Test,
  "com.typesafe.play" %% "anorm" % "2.4.0",
  "mysql" % "mysql-connector-java" % "5.1.36",
  "org.apache.httpcomponents" % "httpmime" % "4.5.1",
  "org.apache.pdfbox" % "pdfbox" % "1.8.10",
  "org.imgscalr" % "imgscalr-lib" % "4.2",
  "com.paymill" % "paymill-java" % "5.1.3",
  "com.typesafe.play" %% "play-mailer" % "3.0.1",
  "com.paymill" % "paymill-java" % "5.1.3"
)

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator
