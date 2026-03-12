import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data/fqs";

export function FAQ() {
  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-[#0C1E33] mb-4">
            Frequently Asked <span className="text-[#0891B2]">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about the Rwanda Olympiad Foundation
            and how you can get involved
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="items-center max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-[#0C1E33] hover:text-[#0891B2] py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600 leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:info@rwandaolympiadfoundation.org"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0891B2] hover:bg-[#0891B2]/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
