 <?php  

  $ch = curl_init("http://ajamesweb/SITApps/SITPortal/PortalPage/MemberLogin.aspx?NodePlant=MG_Subconjuntos");  
 
 curl_exec($ch);  
  
 curl_close($ch); 