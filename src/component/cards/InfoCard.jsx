// Reusable InfoCard Component
// Used in: CustomerDetails, EmiDetails, DeviceDetails, Profile, AllDistributorDetails, AllRetailerDetails, AllSuperDistributorDetails

const InfoCard = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`bg-white rounded-lg border border-slate-200 p-3 hover:border-slate-300 transition-colors duration-200 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg flex-shrink-0">
        <Icon className="text-sm text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  </div>
);

export default InfoCard;
