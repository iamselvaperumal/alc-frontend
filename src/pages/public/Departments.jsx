const Departments = () => {
  const departments = [
    {
      name: "Weaving",
      description:
        "Our weaving department integrates state-of-the-art looms with smart automation to deliver precision-engineered, high-quality fabrics at scale.  We leverage advanced digital monitoring systems to optimize loom performance, minimize downtime, and ensure consistent fabric excellence.  Innovation drives our process — from automated tension control to real-time quality inspection for flawless textile production.  By combining skilled craftsmanship with modern weaving technology, we produce durable, sustainable, and premium-grade fabrics.  Our commitment to continuous improvement and smart manufacturing positions us at the forefront of next-generation textile innovation.",
    },
    {
      name: "Dyeing",
      description:
        "Our dyeing unit adopts eco-friendly processes that ensure vibrant color consistency while minimizing environmental impact.  We utilize advanced dyeing technology with precise temperature and chemical control for uniform and long-lasting shades.  Sustainable water management and low-emission techniques reflect our commitment to green textile manufacturing.  Real-time quality monitoring systems guarantee color accuracy, durability, and superior fabric finish.  By blending innovation with environmental responsibility, we deliver high-performance fabrics with rich, consistent tones.",
    },
    {
      name: "Quality Control",
      description:
        "Our Quality Control department ensures every fabric meets stringent industry standards through advanced inspection systems and precision testing.  We implement real-time defect detection and automated fabric analysis to maintain zero-compromise quality.  Each batch undergoes rigorous testing for strength, color fastness, shrinkage, and durability.  Data-driven monitoring and continuous improvement strategies help us maintain consistent excellence across production.  Our commitment to quality assurance guarantees reliable, premium-grade fabrics that exceed customer expectations.",
    },
    {
      name: "Packing",
      description:
        "Our packing department ensures safe and secure packaging using advanced handling systems to protect fabric quality during transit.  We implement moisture-resistant and damage-proof packaging solutions to maintain product integrity.  Automated labeling and barcode tracking enhance accuracy, traceability, and efficient inventory management.  Eco-friendly packaging materials reflect our commitment to sustainability and responsible manufacturing.  With precision inspection before dispatch, we guarantee that every shipment meets quality and delivery standards.",
    },
    {
      name: "HR",
      description:
        "Our HR department fosters a culture of excellence by attracting, developing, and retaining skilled textile professionals.  We implement structured training programs to enhance technical expertise, safety awareness, and operational efficiency.  Performance-driven evaluation systems ensure productivity, accountability, and continuous growth.  Employee engagement initiatives and welfare programs create a motivated and collaborative workforce.  By integrating digital HR management systems, we streamline recruitment, payroll, and workforce analytics for smarter decision-making.",
    },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
            Our Departments
          </h2>
          <p className="mt-6 text-xl leading-10 font-extrabold text-black">
            1. Our department operates with a strong focus on innovation,
            precision, and continuous improvement across every stage of
            production. <br /> 2. We combine advanced technology with skilled
            expertise to deliver consistent, high-quality textile solutions.
            Process optimization and smart monitoring systems ensure efficiency,
            productivity, and minimal waste.
            <br /> 3. A collaborative work culture empowers teams to achieve
            operational excellence and customer satisfaction. <br /> 4. Through
            strategic planning and forward-thinking practices, our department
            drives sustainable growth and industry leadership. <br /> 5. If you
            want, I can merge all departments into one powerful company profile
            summary ready for brochure.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3 text-center text-lg">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="flex max-w-xl flex-col items-start justify-between bg-gray-50 p-6 rounded-lg hover:bg-blue-500"
            >
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-blue-700 hover:text-white">
                  <span className="absolute inset-0" />
                  {dept.name}
                </h3>
                <p className="mt-5 line-clamp-20 text-m leading-7 text-black">
                  {dept.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Departments;
