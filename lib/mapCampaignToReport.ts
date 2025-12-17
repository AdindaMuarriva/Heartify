import { format } from "date-fns";
import { id } from "date-fns/locale";

export function mapCampaignToReport(campaign: any) {
  return {
    id: campaign._id,
    title: campaign.title,
    category: campaign.category,
    amount: campaign.target, // sementara
    image: campaign.image,

    description: campaign.description,

    location: "Indonesia",
    beneficiaries: campaign.beneficiary,
    duration: "—",
    admin: "Admin Heartify",
    contactPerson: "support@heartify.org",

    completionDate: format(new Date(campaign.deadline), "dd MMMM yyyy", {
      locale: id,
    }),

    details: [
      "Dana disalurkan sesuai kebutuhan program",
      "Distribusi dilakukan oleh tim Heartify",
    ],

    impact: [
      "Penerima manfaat mendapatkan bantuan",
      "Program berjalan sesuai rencana",
    ],
  };
}
