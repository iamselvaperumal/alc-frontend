const About = () => {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
            About Arthanari Loom Center
          </h1>

          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Our History
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Company, well known as ALC was established in the year 1982,
              in a humble way with simple yarn dyeing machines. The company has
              grown by leaps and bounds by its innovative ideas and vision, to
              reach today's status. Satisfied customers, well experienced and
              dedicated manpower, eco-friendly manufacturing approach are our
              STRENGTH. We have installations of State of the Art cotton yarn
              dyeing plant , denim dyeing plant , Fabric weaving facilities with
              Modern airjet looms, HI-Tech fabric process house, ALL UNDER ONE
              ROOF.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded with a vision to revolutionize textile manufacturing, ALC
              has grown from a humble loom center to a large-scale export
              oriented unit, serving clients worldwide.
            </p>
          </section>

          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To be a globally recognized textile manufacturer known for
              innovation, quality, and customer excellence. Creating premium
              textiles that inspire businesses worldwide.
            </p>
          </section>

          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              Our Mission
            </h2>
            <ul className="text-gray-700 space-y-3 list-disc list-inside">
              <li>
                Manufacture premium quality textiles using advanced technology
              </li>
              <li>
                Deliver consistent excellence in product quality and customer
                service
              </li>
              <li>Maintain sustainable and ethical manufacturing practices</li>
              <li>
                Support clients' growth with reliable and innovative solutions
              </li>
              <li>Foster professional development and growth for our team</li>
            </ul>
          </section>

          <section className="bg-indigo-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">
              Why Choose ALC?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✓ Expertise
                </h3>
                <p className="text-gray-600">
                  Decades of excellence in textile manufacturing
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">✓ Quality</h3>
                <p className="text-gray-600">
                  Rigorous standards at every production stage
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✓ Technology
                </h3>
                <p className="text-gray-600">
                  State-of-the-art manufacturing equipment
                </p>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✓ Reliability
                </h3>
                <p className="text-gray-600">
                  Consistent delivery and professional service
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
