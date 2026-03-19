import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Side Quest Party Rentals",
  description: "Privacy Policy for Side Quest Party Rentals LLC.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <Link
          href="/"
          className="inline-block mb-8 text-royal-blue hover:underline font-body text-sm"
        >
          &larr; Back to Home
        </Link>

        <h1 className="font-heading font-bold text-3xl text-navy mb-2">
          Privacy Policy
        </h1>
        <p className="text-navy/50 text-sm font-body mb-10">
          Last modified: 03/17/2026
        </p>

        <div className="prose prose-sm prose-navy max-w-none font-body text-navy/80 space-y-6 [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-navy [&_h2]:text-lg [&_h2]:mt-10 [&_h2]:mb-3">
          <h2>Introduction</h2>
          <p>
            Side Quest Party Rentals LLC (&ldquo;Company&rdquo;) is committed to lawful, fair, and transparent collection of your data. This policy governs data collection by us and our affiliates (collectively the &ldquo;Company&rdquo;) when you purchase or use our products, services, software, and website (collectively the &ldquo;Services&rdquo;). It was drafted to help you understand the types of information we collect from you, how we use it, as well as how we share, store and protect it.
          </p>
          <p>
            If you do not agree with this policy, you should not use our Services. By accessing or using our Services, you agree to this policy, which may change from time to time to better reflect our practices and applicable laws. Your continued use after we make change(s) is deemed acceptance of those changes.
          </p>

          <h2>Children Under the Age of 13</h2>
          <p>
            Our Services are not intended for minors (children under 13 years of age or equivalent depending on jurisdiction, &ldquo;Children&rdquo;), and use of our Services by Children is strictly prohibited. We do not knowingly collect personally identifiable information from Children. If we learn we have collected or received personal information from Children without verification of parental consent, we will delete that information. If you believe we might have any information from or about Children, please contact us.
          </p>

          <h2>Types of Information We Collect</h2>
          <p>
            We collect information if you voluntarily provide it to us. For example, if you sign up for our Services, you might give us your name and email address. You might also give us data when you email us or give us feedback. In addition, you may submit information online through surveys, forms, portals, or other interactive activities on our website. It is always your choice whether or not to provide personal data. Do not provide personal data unless you are authorized to do so.
          </p>

          <p><strong>We may collect the following information directly from you:</strong></p>
          <ul>
            <li>Information that may be personally identified, such as name, address, e-mail address, and other identifier by which you may be contacted online or offline (&ldquo;personal information&rdquo;)</li>
            <li>Information that is about you but individually does not identify you</li>
            <li>Information about how you interact with our website, such as internet connection or the equipment you use to access the Services</li>
          </ul>

          <p>
            This policy does not apply to third-party sites that may link to, or be accessible from, our site. We do not control these third parties&rsquo; tracking technologies or how they may be used. Your interactions with these sites are governed by the third parties&rsquo; applicable privacy statements.
          </p>

          <p><strong>We may also collect information automatically:</strong></p>
          <p>
            As you interact with our website, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns. The information we collect automatically does not include personal information. The technologies we use for this automatic data collection may include cookies. You may refuse to accept browser cookies by activating the appropriate setting on your browser, but if you do you may be unable to access certain parts of our website.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use information that we collect about you or that you provide to us, including personal information to present our Services to you; to provide you with information, products, or services that you request from us; to fulfill any other purpose for which you provide it; to provide you with notices about your account/subscription, including expiration and renewal notices; to carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection; to comply with legal obligations; or for any other purpose with your consent.
          </p>
          <p>
            If you are an EU resident, we will collect and use your personal data only if we have one or more legal bases for doing so under the GDPR.
          </p>

          <h2>Who We Share Your Information With</h2>
          <p>
            We may disclose aggregated information about our users, and information that does not identify any individual, without restriction.
          </p>
          <p>
            We may disclose personal information that we collect or you provide as described in this policy to our team members, agents, subsidiaries and affiliates who have a business need to know; to contractors, service providers, and other third parties we use to support our business; to a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company&rsquo;s assets; to fulfill the purpose for which you provide it; for any other purpose disclosed by us when you provide the information; and/or with your consent.
          </p>
          <p>
            We may also disclose your personal information to comply with any court order, law, or legal process, including to respond to any government or regulatory request; and/or to enforce or apply our terms of use and other agreements, including for billing and collection purposes.
          </p>

          <h2>How We Protect Your Personal Information</h2>
          <p>
            We implement reasonable processes and adhere to best practices in order to protect your Personal Information from accidental loss and from unauthorized access, use, alteration, and disclosure. Unfortunately, the transmission of information via the internet is not completely secure. We will do our best to protect your personal information, but we cannot guarantee the security of your personal information transmitted to our website. Any transmission of personal information is at your own risk.
          </p>

          <h2>Accessing and Correcting Your Information</h2>
          <p>
            You can request to access, correct or delete any personal information that you have provided to us by contacting us at{" "}
            <a href="mailto:SideQuestPartyRentals@gmail.com" className="text-royal-blue hover:underline">
              SideQuestPartyRentals@gmail.com
            </a>
            . We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect.
          </p>

          <h2>How to Contact Us</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at:
          </p>
          <p>
            Side Quest Party Rentals LLC<br />
            Lilburn, Georgia<br />
            <a href="mailto:SideQuestPartyRentals@gmail.com" className="text-royal-blue hover:underline">SideQuestPartyRentals@gmail.com</a><br />
            <a href="tel:4043956339" className="text-royal-blue hover:underline">(404) 395-6339</a>
          </p>
        </div>
      </div>
    </div>
  );
}
