Industrial Lead Source
======================

A javascript helper library for marketing attribution. The library will parse `utm` parameters from the url or set them to appropriate values and 
store them in browser cookies. 
It's up to the developer to retrieve information from the stored cookies and send it to third-party systems.


UTM Url Params
-----------

These utm url params are parsed and stored:
- utm_source
- utm_campaign
- utm_medium
- utm_content
- utm_term



### Usage:

Include javascript library in your page: 

Initialize (DomContentLoaded or similar)
```
var ils = new IndustrialLeadSource(document);
```

Getting values out
```
var ils = new IndustrialLeadSource(document);
var values = ils.getStoredValues();//object with utm_campaign, utm_source... etc. properties.
```


 The following cookie values our store based.
 
- ils_utm_medium
- ils_utm_source
- ils_utm_campaign
- ils_utm_term
- ils_visit (this is session cookie)

---

See this diagram for how utm params are parsed or set to default values based on referrer.

![Parsing Diagram](support/industrial-lead-source-diagram.svg?raw=true "Title")