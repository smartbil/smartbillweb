'use client';
import { useState } from 'react';
import React from 'react';

interface Section {
  id: string;
  title: string;
  content: React.ReactElement;
}

const GuideContent: Section[] = [
  {
    id: 'login',
    title: '1. යෙදුමට පිවිසීම (Login)',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          මුලින්ම, Smart Bill යෙදුමට පිවිසීමට ඔබට අවස්ථාව ලැබේ.
        </p>
        <div className="bg-primary-light p-4 rounded-lg border-l-4 border-primary">
          <ol className="space-y-2 list-decimal list-inside">
            <li>Smart Bill යෙදුම විවෘත කළ විට, පිවිසුම් තිරය දිස්වනු ඇත.</li>
            <li>ඔබට දැනටමත් ගිණුමක් ඇත්නම්, &quot;Email&quot; සහ &quot;Password&quot; ක්ෂේත්‍රවලට ඔබගේ තොරතුරු ඇතුළත් කර &quot;Login&quot; බොත්තම ක්ලික් කරන්න.</li>
            <li>ඔබ සාර්ථකව පිවිසුනු පසු, &quot;Login Successful&quot; යන පණිවිඩය දිස්වනු ඇත. &quot;OK&quot; බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'signup',
    title: '2. නව ගිණුමක් ලියාපදිංචි කිරීම (Sign Up)',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබට Smart Bill යෙදුමේ ගිණුමක් නොමැති නම්, පහත පියවර අනුගමනය කර නව ගිණුමක් ලියාපදිංචි කර ගත හැක.
        </p>
        <div className="bg-success-light p-4 rounded-lg border-l-4 border-success">
          <ol className="space-y-2 list-decimal list-inside">
            <li>පිවිසුම් තිරයේ පහළින් ඇති &quot;Don&apos;t have an account? Register&quot; යන්නෙහි &quot;Register&quot; කොටස ක්ලික් කරන්න.</li>
            <li>දැන් &quot;Sign Up&quot; පිටුව දිස්වනු ඇත. මෙහි &quot;Full Name&quot;, &quot;Email&quot;, &quot;Password&quot;, සහ &quot;Confirm Password&quot; ක්ෂේත්‍රවලට අවශ්‍ය තොරතුරු ඇතුළත් කරන්න.</li>
            <li>සියලු තොරතුරු ඇතුළත් කළ පසු &quot;Sign Up&quot; බොත්තම ක්ලික් කරන්න.</li>
            <li>ඔබගේ ගිණුම සාර්ථකව නිර්මාණය වූ පසු, &quot;Account Created&quot; යන පණිවිඩය දිස්වනු ඇත. &quot;OK&quot; බොත්තම ක්ලික් කරන්න.</li>
            <li>ඉන්පසු, ඔබගේ අලුත් ගිණුම් තොරතුරු භාවිතයෙන් යෙදුමට පිවිසෙන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'packages',
    title: '3. Smart Bill සැලසුම් (Packages) තෝරා ගැනීම',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          සාර්ථකව පිවිසීමෙන් පසු, ඔබට Smart Bill හි විවිධ සැලසුම් පිළිබඳ විස්තර දැකගත හැක.
        </p>
        <div className="bg-accent-light p-4 rounded-lg border-l-4 border-accent">
          <ol className="space-y-2 list-decimal list-inside">
            <li>පිවිසීමෙන් පසු, යෙදුමේ මුල් පිටුව (Home page) දිස්වනු ඇත.</li>
            <li>මෙහිදී ඔබට &quot;Home&quot;, &quot;Policy&quot;, &quot;Packages&quot;, &quot;Profile&quot;, &quot;Privacy&quot; යන විකල්ප දැකිය හැක. &quot;Packages&quot; හෝ අදාළ සැලසුම් කොටස වෙත යන්න.</li>
            <li>විවිධ ව්‍යාපාර අවශ්‍යතා සඳහා සකසා ඇති සැලසුම් (උදා: Starter Plan, Standard Plan, Business Plan) මෙහිදී ඔබට දැකිය හැක.</li>
            <li>ඔබට අවශ්‍ය සැලසුම තෝරාගෙන, ඊට අදාළ &quot;Get Started&quot; බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'subscribe',
    title: '4. සැලසුමකට දායක වීම (Subscribe to a Plan)',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබ සැලසුමක් තෝරාගත් පසු, දායක වීම සඳහා තොරතුරු ඇතුළත් කළ යුතු වේ.
        </p>
        <div className="bg-warning-light p-4 rounded-lg border-l-4 border-warning">
          <ol className="space-y-2 list-decimal list-inside">
            <li>&quot;Subscribe to Standard Plan&quot; (හෝ ඔබ තෝරාගත් සැලසුමට අදාළ) පිටුව දිස්වනු ඇත. මෙහි &quot;FirstName&quot;, &quot;LastName&quot;, &quot;Email&quot;, &quot;Phone&quot;, &quot;Address&quot;, &quot;City&quot; යන ක්ෂේත්‍රවලට ඔබගේ තොරතුරු ඇතුළත් කරන්න.</li>
            <li>අවශ්‍ය තොරතුරු නිවැරදිව ඇතුළත් කළ පසු, &quot;Subscribe Now&quot; බොත්තම ක්ලික් කරන්න.</li>
            <li>දැන් ඔබට PayHere ගෙවීම් පද්ධතිය හරහා ගෙවීම් කිරීමට අවස්ථාව ලැබේ.</li>
            <li>ගෙවීම සාර්ථක වූ පසු, ඔබට නැවත Smart Bill යෙදුමට පිවිසීමට සිදුවේ.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'home-screen',
    title: '5. Smart Bill ප්‍රධාන අතුරුමුහුණත (Home Screen)',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          සාර්ථකව නැවත පිවිසීමෙන් පසු, ඔබට Smart Bill යෙදුමේ ප්‍රධාන අතුරුමුහුණත දිස්වනු ඇත.
        </p>
        <div className="bg-secondary-light p-4 rounded-lg border-l-4 border-secondary">
          <p>මෙම තිරයේදී, ඔබට &quot;POS&quot;, &quot;Orders&quot;, &quot;Products&quot;, &quot;Categories&quot;, &quot;Customers&quot;, &quot;Suppliers&quot;, &quot;Reports&quot;, සහ &quot;Profile&quot; යන ප්‍රධාන කාර්යයන් සඳහා ප්‍රවේශය ලැබේ.</p>
        </div>
      </div>
    )
  },
  {
    id: 'categories',
    title: '6. නිෂ්පාදන වර්ගීකරණය (Categories) කළමනාකරණය',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබට නිෂ්පාදන වර්ග (Categories) එකතු කිරීමට, බැලීමට, හෝ කළමනාකරණය කිරීමට හැකිය.
        </p>
        <div className="bg-info-light p-4 rounded-lg border-l-4 border-info">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;වර්ග (Categories)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>දැනට පවතින නිෂ්පාදන වර්ග ලැයිස්තුව ඔබට දැකගත හැක.</li>
            <li>නව නිෂ්පාදන වර්ගයක් එකතු කිරීමට, ඉහළින් ඇති <strong>&quot;+ නව වර්ගයක් එක් කරන්න (+ Add New Category)&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li><strong>&quot;වර්ගයේ නම (Category Name)&quot;</strong> ක්ෂේත්‍රයට නව වර්ගයේ නම (උදා: Beauty) ඇතුළත් කරන්න.</li>
            <li>දැන් <strong>&quot;වර්ගය එක් කරන්න (Add Category)&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li>එකතු කළ නව වර්ගය ලැයිස්තුවේ දිස්වන අතර, &quot;Category added successfully&quot; යන පණිවිඩයද දැකිය හැක.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'products',
    title: '7. නිෂ්පාදන (Products) කළමනාකරණය',
    content: (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          ඔබට නිෂ්පාදන එකතු කිරීමට, බැලීමට, හෝ කළමනාකරණය කිරීමට හැකිය.
        </p>
        
        <div className="bg-accent-light p-4 rounded-lg border-l-4 border-accent">
          <h4 className="font-semibold text-accent mb-2">නිෂ්පාදන එකතු කිරීම:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;නිෂ්පාදන (Products)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>නව නිෂ්පාදනයක් එකතු කිරීමට, <strong>&quot;+ නව නිෂ්පාදනයක් එක් කරන්න&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li><strong>&quot;Type&quot;</strong> යටතේ එය &quot;Product&quot; (නිෂ්පාදනයක්) ද &quot;Service&quot; (සේවාවක්) ද යන්න තෝරන්න.</li>
            <li>නිෂ්පාදන නම, වර්ගය, මිල, මිලදී ගැනීමේ මිල, ප්‍රමාණය ආදිය ඇතුළත් කරන්න.</li>
            <li><strong>&quot;Add Product&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>

        <div className="bg-info-light p-4 rounded-lg border-l-4 border-info">
          <h4 className="font-semibold text-info mb-2">නිෂ්පාදන තොගය යාවත්කාලීන කිරීම:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>&quot;Products&quot; ලැයිස්තුවෙන්, තොගය යාවත්කාලීන කිරීමට කැමති නිෂ්පාදනය මත ක්ලික් කරන්න.</li>
            <li><strong>&quot;Inventory&quot;</strong> (තොගය) බොත්තම ක්ලික් කරන්න.</li>
            <li><strong>&quot;New Quantity&quot;</strong> ක්ෂේත්‍රයට අලුත් තොග ප්‍රමාණය ඇතුළත් කරන්න.</li>
            <li><strong>&quot;Update&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'pos',
    title: '8. විකුණුම් කවුළුව (POS - Point of Sale) භාවිතය',
    content: (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          නිෂ්පාදන සහ වර්ග කළමනාකරණය කළ පසු, ඔබට විකුණුම් සිදු කිරීමට POS කවුළුව භාවිතා කළ හැක.
        </p>
        
        <div className="bg-primary-light p-4 rounded-lg border-l-4 border-primary">
          <h4 className="font-semibold text-primary mb-2">POS භාවිතය:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;POS&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>නිෂ්පාදන එකතු කිරීම සඳහා, <strong>&quot;නිෂ්පාදන එක් කරන්න (Add Products)&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li>අවශ්‍ය නිෂ්පාදන තෝරාගෙන විකුණුම් කරත්තයට එකතු කරන්න.</li>
            <li>අවශ්‍ය නම් අයිතම සංස්කරණය කිරීමට හෝ වට්ටම් ලබා දීමට නිෂ්පාදනය මත ක්ලික් කරන්න.</li>
          </ol>
        </div>

        <div className="bg-success-light p-4 rounded-lg border-l-4 border-success">
          <h4 className="font-semibold text-success mb-2">ගෙවීම සම්පූර්ණ කිරීම:</h4>
          <ol className="space-y-2 list-decimal list-inside">
            <li>&quot;Proceed to Payment&quot; බොත්තම ක්ලික් කරන්න.</li>
            <li>&quot;Payment Methods&quot; යටතේ &quot;Cash&quot; හෝ &quot;Card&quot; ගෙවන ආකාරය තෝරන්න.</li>
            <li>ගෙවූ මුදල ඇතුළත් කරන්න.</li>
            <li><strong>&quot;විකුණුම සම්පූර්ණ කරන්න (Complete Sale)&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li>අවශ්‍ය නම් ඉන්වොයිසිය මුද්‍රණය කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'orders',
    title: '9. ඇණවුම් (Orders) කළමනාකරණය',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබට සිදුකරන ලද ඇණවුම් සහ ඒවායේ විස්තර බැලීමට හැකිය.
        </p>
        <div className="bg-warning-light p-4 rounded-lg border-l-4 border-warning">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;ඇණවුම් (Orders)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>මෙහිදී ඔබට මාසික (Monthly Sales) සහ දිනපතා (Daily Sales) විකුණුම්වල සාරාංශය දැකගත හැක.</li>
            <li>මෑතකදී සිදුකළ ඇණවුම් (Invoice No., Customer, Total Amount) ලැයිස්තුවක්ද මෙහි දැක්වේ.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'customers',
    title: '10. පාරිභෝගිකයන් (Customers) කළමනාකරණය',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබට පාරිභෝගික තොරතුරු එකතු කිරීමට, බැලීමට, හෝ කළමනාකරණය කිරීමට හැකිය.
        </p>
        <div className="bg-highlight/20 p-4 rounded-lg border-l-4 border-highlight">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතට ආපසු පැමිණ, <strong>&quot;පාරිභෝගිකයන් (Customers)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>නව පාරිභෝගිකයෙකු එකතු කිරීමට, <strong>&quot;+ නව පාරිභෝගිකයෙකු එක් කරන්න&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li><strong>&quot;Customer Name&quot;</strong>, <strong>&quot;Email&quot;</strong>, සහ <strong>&quot;Phone Number&quot;</strong> අදාළ ක්ෂේත්‍රවලට ඇතුළත් කරන්න.</li>
            <li><strong>&quot;Add Customer&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'suppliers',
    title: '11. සැපයුම්කරුවන් (Suppliers) කළමනාකරණය',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබට සැපයුම්කරුවන්ගේ තොරතුරු එකතු කිරීමට, බැලීමට, හෝ කළමනාකරණය කිරීමට හැකිය.
        </p>
        <div className="bg-success-light p-4 rounded-lg border-l-4 border-success">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතට ආපසු පැමිණ, <strong>&quot;සැපයුම්කරුවන් (Suppliers)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li>නව සැපයුම්කරුවෙකු එකතු කිරීමට, <strong>&quot;+ නව සැපයුම්කරුවෙකු එක් කරන්න&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li><strong>&quot;සැපයුම්කරුවාගේ නම&quot;</strong>, <strong>&quot;Email&quot;</strong>, සහ <strong>&quot;Phone Number&quot;</strong> අදාළ ක්ෂේත්‍රවලට ඇතුළත් කරන්න.</li>
            <li><strong>&quot;Add Supplier&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'reports',
    title: '12. වාර්තා (Reports) බැලීම',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබගේ ව්‍යාපාරයේ විවිධ වාර්තා (Reports) බැලීමට හැකිය.
        </p>
        <div className="bg-accent-light p-4 rounded-lg border-l-4 border-accent">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;වාර්තා (Reports)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li><strong>දිනපතා විකුණුම් (Daily Sales)</strong> සහ <strong>මාසික විකුණුම් (Monthly Sales)</strong> වැනි වාර්තා ප්‍රස්ථාර ආකාරයෙන් දැකගත හැක.</li>
            <li><strong>වාර්ෂික විකුණුම් (Yearly Sales)</strong> සහ <strong>ලාභ/අලාභ (Profit/Loss)</strong> ප්‍රස්ථාර ඔබට දැකගත හැක.</li>
            <li>&quot;Top 5 Products&quot; (වැඩිම විකුණුම් සහිත ඉහළම නිෂ්පාදන 5) ප්‍රස්ථාරයක් මගින් දැකගත හැක.</li>
            <li>දින පරාසය තෝරාගෙන වාර්තා පෙරහන් කළ හැක.</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 'profile',
    title: '13. පැතිකඩ (Profile) කළමනාකරණය',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          ඔබගේ ගිණුම් තොරතුරු බැලීමට සහ යාවත්කාලීන කිරීමට Profile අංශය භාවිතා කරන්න.
        </p>
        <div className="bg-light p-4 rounded-lg border-l-4 border-muted">
          <ol className="space-y-2 list-decimal list-inside">
            <li>ප්‍රධාන අතුරුමුහුණතේ ඇති <strong>&quot;පැතිකඩ (Profile)&quot;</strong> අයිකනය ක්ලික් කරන්න.</li>
            <li><strong>&quot;Profile Settings&quot;</strong> පිටුව දිස්වනු ඇත. මෙහිදී <strong>&quot;Personal Information&quot;</strong> සහ <strong>&quot;Business Information&quot;</strong> දැකගත හැක.</li>
            <li>ඔබගේ පැතිකඩ තොරතුරු සංස්කරණය කිරීමට, <strong>&quot;Edit Profile&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li>වෙනස්කම් සිදුකළ පසු, <strong>&quot;Save Changes&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
            <li>ඔබගේ ගිණුමෙන් පිටවීමට, <strong>&quot;පිටවීම (Logout)&quot;</strong> බොත්තම ක්ලික් කරන්න.</li>
          </ol>
        </div>
        <div className="bg-danger-light p-4 rounded-lg border-l-4 border-danger">
          <p className="text-danger">
            <strong>දායකත්ව විස්තර:</strong> මෙම කොටසෙන් ඔබට වත්මන් සැලසුම, තත්ත්වය සහ කල් ඉකුත් වන දිනය දැකගත හැක. ගෙවීම් ඉතිහාසය ද මෙහි ලබා ගත හැක.
          </p>
        </div>
      </div>
    )
  }
];

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState('login');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft via-white to-primary-light font-sinhala">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Smart Bill ජංගම යෙදුම භාවිත මාර්ගෝපදේශය
          </h1>
          <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
            මෙම සම්පූර්ණ මාර්ගෝපදේශය Smart Bill ජංගම යෙදුම භාවිත කරන්නේ කෙසේද යන්න පිළිබඳව 
            පියවරෙන් පියවර පැහැදිලි කරයි. ඔබගේ ව්‍යාපාරය සාර්ථකව කළමනාකරණය කිරීම සඳහා 
            අවශ්‍ය සියලුම කාර්යයන් ඉගෙන ගන්න.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-soft">
                <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  අන්තර්ගතය
                </h2>
                <nav className="space-y-2">
                  {GuideContent.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary-light text-primary font-medium border-l-4 border-secondary'
                          : 'text-muted hover:bg-light hover:text-primary'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="space-y-8">
              {GuideContent.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="guide-section bg-white rounded-2xl shadow-lg p-8 border border-soft hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start mb-6">
                    <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 shadow-lg">
                      {index + 1}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-muted leading-relaxed">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center shadow-xl">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">සම්පූර්ණ කළා! 🎉</h3>
                <p className="text-lg leading-relaxed opacity-90">
                  Smart Bill ජංගම යෙදුම සාර්ථකව භාවිත කිරීමට මෙම සම්පූර්ණ මාර්ගෝපදේශය 
                  ඔබට උපකාරී වනු ඇතැයි අපි විශ්වාස කරමු! ඔබගේ ව්‍යාපාරය වඩාත් කාර්යක්ෂම 
                  සහ ලාභදායක කිරීමට Smart Bill සමඟ ආරම්භ කරන්න.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => scrollToSection('login')}
                    className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-soft transition-colors duration-200"
                  >
                    මුල සිට ආරම්භ කරන්න
                  </button>
                  <a 
                    href="/client/packages"
                    className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-highlight transition-colors duration-200"
                  >
                    සැලසුම් බලන්න
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
