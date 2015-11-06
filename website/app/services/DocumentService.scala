package services

import play.api.Play
import play.api.Play.current

object DocumentService {
  val assessmentDocumentsRootDir = Play.configuration.getString("assessmentDocuments.RootDir").get

  /* TODO
  def getCvFile(order: Order): Option[File] = {
    val cvDirFile = new File(getCvDirForAccountId(accountId))
    cvDirFile.listFiles().headOption
  }

  private def getCvDirForAccountId(accountId: Long): String = {
    getRootDirForAccountId(accountId) + "\\" + assessmentDocumentsCvSubdir
  }

  private def getCoverLetterDirForAccountId(accountId: Long): String = {
    getRootDirForAccountId(accountId) + "\\" + assessmentDocumentsCoverLetterSubdir
  }

  private def getLinkedinProfileDirForAccountId(accountId: Long): String = {
    getRootDirForAccountId(accountId) + "\\" + assessmentDocumentsLinkedinProfileSubdir
  }

  private def getRootDirForAccountId(accountId: Long): String = {
    assessmentDocumentsRootDir + accountId + "\\"
  } */

  /* PHP code to convert Word to PDF. Both should be stored in the documents folder
  function createWordtoPdf($fileToConvert, $pathToSaveOutputFile, $apiKey=200003736, $message, $name) {
    try {
        $rand = time();
        $ext = ".pdf";
       // $fileName = $name;
 $fileName = pathinfo($name, PATHINFO_FILENAME);
        $postdata = array('OutputFileName' => 'MyFile.pdf', 'ApiKey' => $apiKey, 'file' => "@" . $fileToConvert);
        $ch = curl_init("https://do.convertapi.com/Word2Pdf");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
        $result = curl_exec($ch);
        $headers = curl_getinfo($ch);

       $header = ParseHeader(substr($result, 0, $headers["header_size"]));
        $body = substr($result, $headers["header_size"]);

        curl_close($ch);
        if (0 < $headers['http_code'] && $headers['http_code'] < 400) {
            // Check for Result = true

            if (in_array('Result', array_keys($header)) ? !$header['Result'] == "True" : true) {
          echo      $message = "Something went wrong with request, did not reach ConvertApi service.<br />";
                return false;
            }
            // Check content type
            switch ($headers['content_type']) {
                case "application/pdf":
                    $ext = ".pdf";
                    break;
                /*case "application/x-zip-compressed":
                    $ext = ".zip";
                    break;*/
                default :
                    $message = "Exception Message : returned content is not correct.<br />";
                    return false;
            }

            $fp = fopen($pathToSaveOutputFile . $fileName . $ext, "w");

            fwrite($fp, $body);

            $message = "The conversion was successful! The pdf file $fileToConvert converted to JPEG and saved at $pathToSaveOutputFile$fileName$ext";
            return true;
        } else {
            $message = "Exception Message : " . $result . ".<br />Status Code :" . $headers['http_code'] . ".<br />";
            echo $message;
            return false;
        }
    } catch (Exception $e) {
        $message = "Exception Message :" . $e . Message . "</br>";
        return false;
    }
} */

  /* PHP code to convert web page to PDF
  if ($file!=""  && $_POST['productCheckPost'] == 'block;')
 {
   if (strpos($file, "http://") !== false)
   {}
   else
   {
    if (strpos($file, "https://") !== false)  {}
    else
    $file= "http://" . $file;
   }
   $fp = fopen ("documents/".$id."-LinkedIn_Profile.pdf", "w");
   $ch = curl_init ("https://do.convertapi.com/Web2Pdf/inline?ApiKey=$convertApiKey&curl=$file?PrintView=Pdf");
   curl_setopt ($ch, CURLOPT_FILE, $fp);
   curl_setopt ($ch, CURLOPT_HEADER, 0);
   curl_exec ($ch);
   curl_close ($ch);
   $li_pdf_name=$id."-LinkedIn_Profile.pdf";
   $db->SetValue("Update documents set file_li='".$li_pdf_name."' where id='".$id."';");
   $db->SetValue("Update documents set li_url='".$file."' where id='".$id."';");
   fclose ($fp);
   createImage($id."-LinkedIn_Profile.pdf");
 }
   */
}
