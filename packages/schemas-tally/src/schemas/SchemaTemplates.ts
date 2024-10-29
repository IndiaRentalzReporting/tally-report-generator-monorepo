/*
Company
id
MasterID
AlterID
Guid
CompanyNumber
Company Name
Company Mail Name
GST Number

Ledger Group
id
MasterID
AlterID
Guid
CompanyID
Name
Parent
AliasName
PrimaryGroup
NatureofGroup

<<Ledger>>
id
MasterID
AlterID
Guid
CompanyID
Name
Parent
AliasName
PrimaryGroup
AddressLine1
AddressLine2
AddressLine3
State
GSTNumber
PINCode
City
emailID
MobileNo
ContactPerson
opendingBalance
natureofgroup
Region
Salesperson
Route
Channel
Segment
Creation Date

<<Units>>
id
MasterID
AlterID
Guid
CompanyID
Name

<<StockGroup>>
id
MasterID
AlterID
Guid
CompanyID
Name
Parent
ALiasName

<<StockCategory>>
id
MasterID
AlterID
Guid
CompanyID
Name
Parent
ALiasName

<<StockItem>>
id
MasterID
AlterID
Guid
CompanyID
Name
Parent
GroupMasterID
ALiasName
Category
CategoryMasterID
BaseUnit
BaseUnitMasterID
AttributeStr01
AttributeStr02
AttributeStr03
AttributeStr04
AttributeStr05
AttributeStr06
AttributeStr06
AttributeStr06
AttributeStr06
AttributeStr06
AttributeNum01
AttributeNum01
AttributeNum01
AttributeNum01
AttributeNum01

<<VoucherType>>

<<Voucher>>
id
MasterID
AlterID
Guid
CompanyID
VoucherTypeName
Date
VoucherNumberpackages/schemas-tally/src/schemas/SchemaTemplates.ts
Narration

<<VoucherInventory>>
id
MasterID
AlterID
Guid
CompanyID
VoucherTypeName
Date
VoucherNumber
StockItemName
StockItemMasterID
BilledQty
ActualQty
InwardQty
OutwardQty
Discount
Amount
Rate

<<VoucherLedger>>
id
MasterID
AlterID
Guid
CompanyID
VoucherTypeName
Date
VoucherNumber
LedgerName
LedgerMasterID

*/
