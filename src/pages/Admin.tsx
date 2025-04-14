
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAbout from '../components/admin/AdminAbout';
import AdminSkills from '../components/admin/AdminSkills';
import AdminPortfolio from '../components/admin/AdminPortfolio';
import AdminCertificates from '../components/admin/AdminCertificates';
import AdminContact from '../components/admin/AdminContact';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to website
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="about">About Me</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        <div className="border rounded-lg p-6">
          <TabsContent value="about">
            <AdminAbout />
          </TabsContent>
          <TabsContent value="skills">
            <AdminSkills />
          </TabsContent>
          <TabsContent value="portfolio">
            <AdminPortfolio />
          </TabsContent>
          <TabsContent value="certificates">
            <AdminCertificates />
          </TabsContent>
          <TabsContent value="contact">
            <AdminContact />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Admin;
