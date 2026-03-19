import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Side Quest Party Rentals",
  description: "Terms of Service for Side Quest Party Rentals LLC.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Link
          href="/"
          className="inline-block mb-8 text-royal-blue hover:underline font-body text-sm"
        >
          &larr; Back to Home
        </Link>

        <h1 className="font-heading font-bold text-3xl text-navy mb-10">
          Terms of Service
        </h1>

        <div className="prose prose-sm prose-navy max-w-none font-body text-navy/80 space-y-6 [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-navy [&_h2]:text-lg [&_h2]:mt-10 [&_h2]:mb-3">
          <h2>1. Terms</h2>
          <p>
            By accessing the site at SideQuestPR.com, you consent to be bound by these terms of service, all applicable laws, and regulations. You agree that you are responsible for compliance with any applicable local laws. If you do not agree with these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on SideQuestPR.com for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ol>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>Attempt to decompile or reverse engineer any software contained on SideQuestPR.com;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server.</li>
          </ol>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by SideQuestPR.com at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on SideQuestPR.com are provided on an &ldquo;as is&rdquo; basis. SideQuestPR.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            Further, SideQuestPR.com does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials on any sites linked to this site.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall SideQuestPR.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SideQuestPR.com, even if SideQuestPR.com or a SideQuestPR.com authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on SideQuestPR.com could include technical, typographical, or photographic errors. SideQuestPR.com does not warrant that any of the materials on its website are accurate, complete, or current. SideQuestPR.com may make changes to the materials contained on its website at any time without notice. However, SideQuestPR.com does not make any commitment to update the materials.
          </p>

          <h2>6. Links</h2>
          <p>
            SideQuestPR.com has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SideQuestPR.com. Use of any such linked website is at the user&rsquo;s own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            SideQuestPR.com may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Georgia, and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
          </p>
        </div>
      </div>
    </div>
  );
}
